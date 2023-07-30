import { generateRefreshToken, generateToken } from '../configs/token.js';

import Role from '../models/role.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { signupSchema } from '../validates/auth.js';
import slugify from 'slugify';

dotenv.config();

export const userController = {
  // get all
  getAllUser: async (req, res) => {
    const { _sort = 'createAt', _order = 'asc', _limit = 10, _page = 1 } = req.query;
    const options = {
      page: _page,
      limit: _limit,
      sort: {
        [_sort]: _order === 'desc' ? -1 : 1,
      },
      populate: [{ path: 'role', select: '-users' }, { path: 'order' }, { path: 'products' }],
    };
    try {
      const users = await User.paginate({}, options);
      if (users.length === 0) {
        return res.json({
          message: 'Không có user nào',
        });
      }
      /* loại bỏ password */
      users.docs.map((user) => {
        user.password = undefined;
      });
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate([
        { path: 'role', select: '-users' },
        { path: 'order' },
        { path: 'products' },
      ]);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
      }
      user.password = undefined;
      return res.status(200).json({
        message: 'Lấy thông tin người dùng thành công',
        user,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
  // register
  register: async (req, res) => {
    try {
      const { error } = signupSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const errors = error.details.map((error) => error.message);
        return res.status(400).json({
          message: errors,
        });
      }

      const findUser = await User.findOne({ account: req.body?.account });
      if (!findUser) {
        // create user
        const roleUser = await Role.findOne({ name: 'customer' });
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
          ...req.body,
          password: hashedPassword,
          role: roleUser._id,
          avatar: `https://ui-avatars.com/api/?name=${req.body.username}`,
          slug: slugify(req.body.username, { lower: true }),
        });

        await Role.updateOne({ name: 'customer' }, { $addToSet: { users: user._id } });

        if (!roleUser) {
          return res.status(400).json({ message: 'fail', err: 'Register fail' });
        }

        return res.status(201).json({
          message: 'register success',

          user: {
            _id: user._id,
            username: user.username,
            account: user.account,
            address: user.address,
            slug: user.slug,
          },
        });
      } else {
        throw new Error('User already exists');
      }
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  },

  // login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // check user exists or not
      const findUser = await User.findOne({ email }).populate('role');
      if (!findUser) {
        return res.status(400).json({ message: 'Tài khoản không tồn tại' });
      }
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Tài khoản hoặc Mật khẩu không khớp' });
      }

      const token = generateToken({ id: findUser?._id, role: findUser.role });
      const refreshToken = generateRefreshToken({ id: findUser?._id, role: findUser.role });
      await findUser.updateOne({ refreshToken: refreshToken });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });
      return res.json({
        message: 'loign success',
        user: {
          _id: findUser?._id,
          username: findUser?.username,
          slug: findUser?.slug,
          account: findUser?.account,
          address: findUser.address,
          avatar: findUser.avatar,
          accessToken: token,
          refreshToken,
        },
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  logOut: async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      await User.findOneAndUpdate({ refreshToken: refreshToken }, { refreshToken: '' });
      // req.logout(function (err) {
      //   if (err) {
      //     return res.status(400).json({ message: 'fail', err: err });
      //   }
      //   return res.status(200).json({ status: true });
      // });
      res.clearCookie('refreshToken');
      return res.status(200).json({ message: 'success', announce: 'Logged Out!' });
    } catch (error) {
      next(error);
    }
  },

  handleRefreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json("You're not authenticated");
      const refreshUser = await User.find({}, { _id: 0, 'refreshToken.$': 1 });
      const listRefresh = refreshUser.map(({ refreshToken }) => refreshToken);
      if (!listRefresh.includes(refreshToken)) {
        return res.status(403).json('RefreshToken is not valid');
      }
      jwt.verify(refreshToken, process.env.SECRET_REFRESH, async (err, user) => {
        if (err) {
          return res.status(403).json('RefreshToken is not valid');
        }
        const newAccessToken = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);
        await User.findByIdAndUpdate(user.id, { refreshToken: newRefreshToken });
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'strict',
        });
        return res.status(200).json({ accessToken: newAccessToken });
      });
      // const { token: refreshToken } = req.params;

      // const isHasUser = jwt.verify(refreshToken, process.env.JWT_SECRET);

      // const user = await User.findById(isHasUser?.id);
      // if (!user || !refreshToken) throw new Error('No refresh token present in db or not matched');

      // if (refreshToken && user) {
      //   const accessToken = generateToken(user?._id);

      //   res.json({
      //     message: 'refreshToken success',
      //     data: accessToken,
      //   });
      // }
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  },
  updateUser: async (req, res) => {
    // const { _id } = req.user;
    // check id
    try {
      const result = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!result) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
      }
      /* update slug */
      const slug = slugify(result.username, { lower: true });
      result.slug = slug;
      /* loại bỏ slug */
      result.password = undefined;
      res.json({
        message: 'update success',
        user: result,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
  deleteUser: async (req, res) => {
    // const { _id } = req.user;
    try {
      const userDelete = await User.findByIdAndDelete(req.params.id);
      await Role.findByIdAndUpdate(userDelete.role, { $pull: { users: userDelete._id } });
      res.json({
        message: 'User deleted successfully',
        user: userDelete,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
  // update passwword
  updatePassword: async (req, res) => {
    try {
      // const { _id } = req.user;
      const { password, passwordNew } = req.body;
      const user = await User.findById(req.params.id);
      if (findUser && (await findUser.isPasswordMatched(password))) {
        // if (password && user) {
        const hashedPassword = await bcrypt.hash(passwordNew, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({
          message: 'update password success',
        });
      }
    } catch (error) {
      res.json({ message: error });
    }
  },

  changeRoleUser: async (req, res, next) => {
    try {
      const { id, idRole } = req.params;
      const user = await User.findById(id);
      const oldRole = await Role.findByIdAndUpdate(user.role, { $pull: { users: id } });
      await user.updateOne({ role: idRole });
      const newRole = await Role.findByIdAndUpdate(idRole, { $addToSet: { users: id } });

      if (!user || !oldRole || !newRole) {
        return res.status(404).send({ message: 'fail', err: 'Change Role Failed' });
      }
      return res.status(200).send({ message: 'success', data: user });
    } catch (error) {
      next(error);
    }
  },
};
