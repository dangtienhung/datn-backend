import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_REFRESH, {
    expiresIn: '3d',
  });
};
