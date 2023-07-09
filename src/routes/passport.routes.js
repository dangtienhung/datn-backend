import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
const PassportRoutes = express.Router();

PassportRoutes.get('/google', passport.authenticate('google', { scope: ['profile'] }));

PassportRoutes.get('/twitter', passport.authenticate('twitter'));

PassportRoutes.get('/github', passport.authenticate('github'));

PassportRoutes.get('/facebook', passport.authenticate('facebook'));

PassportRoutes.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect(process.env.HOMEPAGE);
  }
);

PassportRoutes.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect(process.env.HOMEPAGE);
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
    failureRedirect: process.env.HOME,
  }),
  function (req, res) {
    res.redirect(process.env.HOMEPAGE);
  }
);

PassportRoutes.get('/getUser', (req, res) => {
  res.send({ user: req.user });
});

PassportRoutes.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(400).json({ message: 'fail', err: err });
    }
    res.status(200).json({ status: true });
  });
});

export default PassportRoutes;
