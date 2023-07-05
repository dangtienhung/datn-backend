import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authMiddleware = {
  verifyToken: async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')) {
      token = req.headers?.authorization?.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded", decoded);
        const user = await User.findById(decoded?.id).populate('role');
        req.user = user;
        next();
      } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          return res.status(200).json({
            message: 'Token không hợp lệ',
            err,
          });
        }
        if (err.name === 'TokenExpiredError') {
          return res.json({
            message: 'Token hết hạn',
            err,
          });
        }

        throw new Error({
          message: 'Not authorized token expired, Please login again',
          err,
        });
      }
    } else {
      throw new Error({
        message: 'There is no token attached to header',
      });
    }
  },
  verifyTokenAdmin: async (req, res, next) => {
    authMiddleware.verifyToken(req, res, () => {
      if (req.user.role.name === 'admin' && req.user.role.status === 'active') {
        next();
      } else {
        return res.status(403).json("You're not allowed to this task!!");
      }
    });
  },
};
// check admin co quyền đc sửa tk user
// export const isAdmin = async (req, res, next) => {
//   const { email } = req.user;
//   const adminUser = await User.findOne({ email });
//   if (adminUser.role !== "admin") {
//     throw new Error("You are not an admin")
//   } else {
//     next();
//   }
// }
