import { generateRefreshToken, generateToken } from '../configs/token.js';
import crypto from 'crypto'
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { signupSchema } from '../validates/auth.js';
import slugify from 'slugify';
import { userValidate } from '../validates/user.validate.js';
import { sendEmail } from '../configs/sendMail.js';

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
      populate: [{ path: 'order' }],
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
        { path: 'order' },
        // { path: 'products' },
      ]);
      if (!user) {
        return res.status(500).json({ message: 'Không tìm thấy thông tin người dùng' });
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
      // console.log(req.body);
      const { error } = signupSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const errors = error.details.map((error) => error.message);
        return res.status(400).json({
          message: errors,
        });
      }

      const findUser = await User.findOne({ account: req.body?.account });
      // console.log(findUser);
      if (!findUser) {
        // create user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
          username: req.body.username,
          account: req.body.account,
          password: hashedPassword,
          // role: 'customer',
          avatar: `https://ui-avatars.com/api/?name=${req.body.username}`,
          gender: 'male',
          birthday: new Date('1999-01-01'),
        });

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
      const { account, password } = req.body;
      // check user exists or not
      const findUser = await User.findOne({ account }).populate([
        { path: 'address', select: 'name address phone' },
      ]);
      if (!findUser) {
        return res.status(400).json({ message: 'Tài khoản không tồn tại' });
      }
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Tài khoản hoặc Mật khẩu không khớp' });
      }

      const token = generateToken({
        id: findUser?._id,
        username: findUser?.username,
        role: findUser.role,
      });
      const refreshToken = generateRefreshToken({
        id: findUser?._id,
        username: findUser?.username,
        role: findUser.role,
      });
      await findUser.updateOne({ refreshToken: refreshToken });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });
      return res.json({
        message: 'login success',
        user: {
          _id: findUser?._id,
          username: findUser?.username,
          slug: findUser?.slug,
          account: findUser?.account,
          address: findUser.address,
          avatar: findUser.avatar,
          accessToken: token,
          refreshToken,
          role: findUser.role,
          birthday: findUser.birthday,
          gender: findUser.gender,
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
      res.clearCookie('refreshToken');
      return res.status(200).json({ message: 'success', announce: 'Logged Out!' });
    } catch (error) {
      next(error);
    }
  },

  handleRefreshToken: async (req, res) => {
    try {
      const { token: refreshToken } = req.params;

      const isHasUser = jwt.verify(refreshToken, process.env.JWT_SECRET);

      const user = await User.findById(isHasUser?.id);
      if (!user || !refreshToken) throw new Error('No refresh token present in db or not matched');

      if (refreshToken && user) {
        const accessToken = generateToken(user?._id);

        res.json({
          message: 'refreshToken success',
          data: accessToken,
        });
      }
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
      // result.password = undefined;
      res.json({
        message: 'update success',
        user: result,
      });
    } catch (error) {
      throw new Error(error);
    }
  },

  updateInfor: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(400).json({ error: 'Update error' });
      }
      const slug = slugify(req.body.username, { lower: true });
      const token = generateToken({ id: user?._id, role: user.role });
      const refreshToken = generateRefreshToken({ id: user?._id, role: user.role });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });

      const dataUpdate = {
        ...req.body,
        birthday: new Date(req.body.birthday),
        slug: slug,
        accessToken: token,
        refreshToken,
      };
      const updateUser = await User.findByIdAndUpdate(id, dataUpdate, { new: true });
      res.status(200).json({
        message: 'Update Success',
        user: {
          _id: updateUser?._id,
          username: updateUser?.username,
          slug: updateUser?.slug,
          account: updateUser?.account,
          address: updateUser.address,
          avatar: updateUser.avatar,
          role: updateUser.role,
          birthday: updateUser.birthday,
          grade: updateUser.grade,
          gender: updateUser.gender,
          accessToken: token,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res) => {
    // const { _id } = req.user;
    try {
      const userDelete = await User.findByIdAndDelete(req.params.id);
      // await Role.findByIdAndUpdate(userDelete.role, { $pull: { users: userDelete._id } });
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
      const { id, role } = req.params;
      const user = await User.findById(id);
      await user.updateOne({ role: role });

      if (!user || !role) {
        return res.status(404).send({
          message: 'fail',
          err: 'Change Role Failed',
        });
      }
      return res.status(200).send({
        message: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  isActiveUser: async (req, res) => {
    try {
      const { idUser } = req.params;

      const newRole = await User.findOneAndUpdate(
        { _id: idUser },
        { status: req.body.status },
        { new: true }
      );

      if (!idUser || !req.body.status) {
        return res.status(400).send({
          message: 'fail',
          err: 'Change Status account Failed',
        });
      }
      newRole.password = undefined;
      return res.status(200).send({
        message: 'success',
        data: newRole,
      });
    } catch (error) {
      return res
        .status(400)
        .send({ message: 'fail', err: `Change Status account Failed: ${error}` });
    }
  },
  // get role user
  getAllRoleUser: async (req, res) => {
    try {
      const { roleName } = req.params;
      if (!roleName) {
        return res.status(400).send({ message: 'fail', err: 'Role name not found' });
      }

      const { _page = 1, _limit = 10, q } = req.query;
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
      };

      const userRole = await User.paginate({ role: roleName }, options);

      return res.status(200).send({
        message: 'success',
        data: userRole,
      });
    } catch (error) {
      res.status(400).send({
        message: 'fail',
        err: `errorl ${error}`,
      });
    }
  },

  /* create user */
  createUser: async (req, res) => {
    try {
      const body = req.body;
      console.log('body', req.body);
      /* validate */
      const { error } = userValidate.validate(body, { abortEarly: false });
      if (error) {
        const errors = error.details.map((error) => error.message);
        return res.status(400).json({
          message: errors,
        });
      }
      /* check account exists */
      const accountExit = await User.findOne({ account: body.account });
      console.log('🚀 ~ file: user.controllers.js:298 ~ createUser: ~ accountExit:', accountExit);
      if (accountExit) {
        return res.status(400).json({
          message: 'Account đã tồn tại',
        });
      }
      /* check username exists */
      const userNameExits = await User.findOne({ username: body.username });
      if (userNameExits) {
        return res.status(400).json({
          message: 'Username đã tồn tại',
        });
      }

      /* check account exists */
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      console.log(
        '🚀 ~ file: user.controllers.js:311 ~ createUser: ~ hashedPassword:',
        hashedPassword
      );

      const user = await User.create({
        ...req.body,
        password: hashedPassword,
        avatar: body.avatar ? body.avatar : `https://ui-avatars.com/api/?name=${req.body.username}`,
        gender: body.gender,
      });

      return res.status(200).json({
        message: 'Created success',
        user: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          gender: user.gender,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // generatePasswordResetToken: () => {
  //   const token = crypto.randomBytes(32).toString('hex')
  //   const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  //   return { token, hashedToken }
  // },

  // reset password
  sendMailForgotPassword: async (req, res) => {
    const { email } = req.body
    console.log(email)
    try {
      const foundUser = await User.findOne({ account: email })

      if (!foundUser) {
        return res.status(400).json({
          message: 'Email does not exists.',
        })
      }
      const token = crypto.randomBytes(32).toString('hex')
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex')


      foundUser.passwordChangedAt = new Date()
      foundUser.passwordResetToken = hashedToken
      foundUser.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000)
      await foundUser.save()
      const resetURL = `Please follow this link to reset your password. This link is valid still 10 minutes from now. <a href="http://localhost:8080/api/auth/reset-password/${token}">Click Here</a>`

      const data = {
        to: email,
        text: 'Hi!',
        subject: 'Forgot Password Link',
        html: resetURL,
      }
      await sendEmail(data)
      return res.status(200).json({
        message: 'Email reset password sent.',
        data: { token },
      })
    } catch (error) {
      return res.status(400).json({
        message: `Something went wrong! ${error.message || ''}.`,
      })
    }
  },
  resetPassword: async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    try {
      const foundUser = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
      })

      if (!foundUser) {
        return res.status(400).json({
          message: 'Token invalid or expired. Please try again.',
        })
      }

      const salt = await bcrypt.genSalt(10);

      const passwordNew = await bcrypt.hash(password, salt);

      foundUser.password = passwordNew
      foundUser.passwordResetToken = null
      foundUser.passwordResetExpires = null

      await foundUser.save()

      return res.status(200).json({
        message: 'Reset password successfully.',
        data: {
          user: foundUser,
        },
      })
    } catch (error) {
      return res.status(400).json({
        message: `Something went wrong! ${error.message || ''}`,
      })
    }
  }

};
