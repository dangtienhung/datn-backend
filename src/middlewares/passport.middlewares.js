import passportOauth from 'passport-google-oauth20';
import passportTwitter from 'passport-twitter';
import passportGithub from 'passport-github';
import passportFacebook from 'passport-facebook';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import slugify from 'slugify';
import Role from '../models/role.model.js';
const GoogleStrategy = passportOauth.Strategy;
const TwitterStrategy = passportTwitter.Strategy;
const GithubStrategy = passportGithub.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
dotenv.config();

const passportMiddleware = {
  GoogleAuth: new GoogleStrategy(
    {
      clientID: process.env.GOOGLEID,
      clientSecret: process.env.SECRETGOOGLEID,
      callbackURL: process.env.CALLBACKURLGOOGLE,
    },
    function (accessToken, refreshToken, profile, cb) {
      (async () => {
        try {
          const user = await User.findOne({ googleId: profile.id });
          if (!user) {
            const roleUser = await Role.findOne({ name: 'customer' });
            const newUser = await User.create({
              googleId: profile.id,
              username: profile.name.givenName,
              avatar: profile.photos[0].value,
              slug: slugify(profile.name.givenName, { lower: true }),
              role: roleUser._id,
            });
            await Role.updateOne({ name: 'customer' }, { $addToSet: { users: newUser._id } });
            cb(null, newUser);
          }
          cb(null, user);
        } catch (error) {
          cb(error, null);
        }
      })();
    }
  ),
  TwitterAuth: new TwitterStrategy(
    {
      consumerKey: process.env.TWITTERKEY,
      consumerSecret: process.env.SECRETTWITTER,
      callbackURL: process.env.CALLBACKURLTWITTER,
      proxy: false,
    },
    function (accessToken, refreshToken, profile, cb) {
      (async () => {
        try {
          const user = await User.findOne({ twitterId: profile.id });
          if (!user) {
            const roleUser = await Role.findOne({ name: 'customer' });
            const newUser = await User.create({
              twitterId: profile.id,
              username: profile.username,
              avatar: profile.photos[0].value,
              slug: slugify(profile.username, { lower: true }),
              role: roleUser._id,
            });
            cb(null, newUser);
          }
          cb(null, user);
        } catch (error) {
          cb(error, null);
        }
      })();
    }
  ),
  GithubAuth: new GithubStrategy(
    {
      clientID: process.env.GITHUBID,
      clientSecret: process.env.SECRETGITHUB,
      callbackURL: process.env.CALLBACKURLGITHUB,
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      (async () => {
        try {
          const user = await User.findOne({ githubId: profile.id });
          if (!user) {
            const roleUser = await Role.findOne({ name: 'customer' });
            const newUser = await User.create({
              githubId: profile.id,
              username: profile.username,
              avatar: profile.photos[0].value,
              slug: slugify(profile.username, { lower: true }),
              role: roleUser._id,
            });
            cb(null, newUser);
          }
          cb(null, user);
        } catch (error) {
          cb(error, null);
        }
      })();
    }
  ),
  FacebookAuth: new FacebookStrategy(
    {
      clientID: process.env.FACEBOOKID,
      clientSecret: process.env.SECRETFACEBOOK,
      callbackURL: process.env.CALLBACKURLFACEBOOK,
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      (async () => {
        try {
          const user = await User.findOne({ facebookId: profile.id });
          if (!user) {
            const roleUser = await Role.findOne({ name: 'customer' });
            const newUser = await User.create({
              facebookId: profile.id,
              username: profile.displayName,
              avatar: `https://ui-avatars.com/api/?name=${profile.displayName}`,
              slug: slugify(profile.displayName, { lower: true }),
              role: roleUser._id,
            });
            cb(null, newUser);
          }
          cb(null, user);
        } catch (error) {
          cb(error, null);
        }
      })();
    }
  ),
};

export default passportMiddleware;
