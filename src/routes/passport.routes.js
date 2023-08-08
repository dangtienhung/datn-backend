import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import { generateRefreshToken, generateToken } from '../configs/token.js';
dotenv.config();
const PassportRoutes = express.Router();

PassportRoutes.get('/google', passport.authenticate('google', { scope: ['profile'] }));

PassportRoutes.get('/twitter', passport.authenticate('twitter'));

PassportRoutes.get('/github', passport.authenticate('github'));

PassportRoutes.get('/facebook', passport.authenticate('facebook'));

PassportRoutes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.LOGINPAGE }),
  function (req, res) {
    const { role } = req.user;
    if (role.name === 'customer') {
      res.redirect(process.env.HOMEPAGE);
    } else if (role.name === 'admin') {
      res.redirect(process.env.AMINPAGE);
    }
  }
);

PassportRoutes.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: process.env.LOGINPAGE }),
  function (req, res) {
    const { role } = req.user;
    if (role.name === 'customer') {
      res.redirect(process.env.HOMEPAGE);
    } else if (role.name === 'admin') {
      res.redirect(process.env.AMINPAGE);
    }
  }
);

PassportRoutes.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: process.env.HOME }),
  function (req, res) {
    res.redirect(process.env.HOMEPAGE);
  }
);

PassportRoutes.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: process.env.LOGINPAGE,
  }),
  function (req, res) {
    const { role } = req.user;
    if (role.name === 'customer') {
      res.redirect(process.env.HOMEPAGE);
    } else if (role.name === 'admin') {
      res.redirect(process.env.AMINPAGE);
    }
  }
);

PassportRoutes.get('/getUser', async (req, res) => {
  const user = req.user;
  if (user) {
    const token = generateToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
    await User.findOneAndUpdate({ _id: user._id }, { refreshToken: refreshToken });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    });
    return res.json({
      user: {
        _id: user?._id,
        username: user?.username,
        slug: user?.slug,
        account: user?.account,
        address: user.address,
        avatar: user.avatar,
        role: {
          name: user.role.name,
          status: user.role.status,
        },
        accessToken: token,
        refreshToken,
      },
    });
  }
  return res.json({});
});

PassportRoutes.post('/logout', (req, res) => {
  req.logout(function (err) {
    res.clearCookie('refreshToken');
    if (err) {
      return res.status(400).json({ message: 'fail', err: err });
    }
    res.status(200).json({ status: true });
  });
});

export default PassportRoutes;
