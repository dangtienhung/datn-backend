import User from "../models/user.model.js";
import { signupSchema } from "../validates/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../configs/token.js"
import dotenv from 'dotenv'
dotenv.config()



export const userController = {
  // get all 
  getAllUser: async (req, res) => {
    const { _sort = "createAt", _order = "asc", _limit = 10, _page = 1 } = req.query;
    const options = {
      page: _page,
      limit: _limit,
      sort: {
        [_sort]: _order === "desc" ? -1 : 1,
      },
    };
    try {
      const users = await User.paginate({}, options);
      if (users.length === 0) {
        return res.json({
          message: "Không có user nào",
        });
      }
      return res.json(users);
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }

  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
      }
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
      const { error } = await signupSchema.validate(
        req.body,
        { abortEarly: false }
      );
      if (error) {
        const errors = error.details.map((error) => error.message);
        return res.status(400).json({
          message: errors,
        });
      }

      const findUser = await User.findOne({ email: req.body?.email })
      if (!findUser) {
        // create user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
          ...req.body,
          password: hashedPassword,
        });

        return res.status(201).json({
          message: "register success",

          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            slug: user.slug,
          },
        });

      }
      else {
        throw new Error('User already exists')
      }
    } catch (error) {
      res.status(400).json({
        message: error,
      });
    }
  },
  // login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      // check user exists or not
      const findUser = await User.findOne({ email });
      if (!findUser) {
        return res.status(400).json({ message: "Tài khoản không tồn tại" });
      }
      const isMatch = await bcrypt.compare(password, findUser.password)
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không khớp" });
      }

      const token = await generateToken(findUser?._id)
      const refreshToken = await generateRefreshToken(findUser?._id)
      return res.json({
        message: "loign success",
        user: {
          _id: findUser?._id,
          username: findUser?.username,
          slug: findUser?.slug,
          email: findUser?.email,
          phone: findUser?.phone,
          address: findUser.address,
          accessToken: token,
          refreshToken,
        }
      });


    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

  },

  handleRefreshToken: async (req, res) => {
    try {
      const { token: refreshToken } = req.params;


      const isHasUser = jwt.verify(refreshToken, process.env.JWT_SECRET)

      const user = await User.findById(isHasUser?.id)
      if (!user || !refreshToken) throw new Error("No refresh token present in db or not matched");

      if (refreshToken && user) {

        const accessToken = generateToken(user?._id)

        res.json({
          message: "refreshToken success",
          data: accessToken
        })
      }
    } catch (error) {
      res.json({
        message: error.message
      })
    }
  }
  ,
  updateUser: async (req, res) => {
    const { _id } = req.user;
    // check id 

    try {
      const result = await User.findByIdAndUpdate(_id, req.body, {
        new: true
      })
      result.password = undefined
      res.json({
        message: "update success",
        user: result
      })
    } catch (error) {
      throw new Error(error)
    }
  },
  deleteUser: async (req, res) => {
    const { _id } = req.user

    try {
      const userDelete = await User.findByIdAndDelete(_id)
      res.json({
        message: 'User deleted successfully',
        user: userDelete
      })
    } catch (error) {
      throw new Error(error)
    }
  },
  // update passwword
  updatePassword: async (req, res) => {
    try {
      const { _id } = req.user;
      const { password, passwordNew } = req.body
      const user = await User.findById(_id);
      if (findUser && (await findUser.isPasswordMatched(password))) {
        // if (password && user) {
        const hashedPassword = await bcrypt.hash(passwordNew, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({
          message: "update password success",
        });

      }
    } catch (error) {
      res.json({ message: error })
    }
  }
}

