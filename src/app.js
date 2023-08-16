import * as dotenv from 'dotenv';

import { errHandler, notFound } from './middlewares/errhandle.js';

import PassportRoutes from './routes/passport.routes.js';
import User from './models/user.model.js';
import { connectDb } from './configs/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import middleSwaggers from './docs/index.js';
import morgan from 'morgan';
import passport from 'passport';
import passportMiddleware from './middlewares/passport.middlewares.js';
import rootRoutes from './routes/index.js';
import session from 'express-session';

dotenv.config();

/* config */
const app = express();
app.use(morgan('common'));
// app.use(cors({ origin: '*' }));
app.use(cookieParser());
app.use(express.json());
// app.use(cors({ origin: '*', credentials: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(
  session({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: 'auto',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser((id, done) => {
  (async () => {
    const user = await User.findById(id);
    return done(null, user);
  })();
});

/* OAuth2 */
passport.use(passportMiddleware.GoogleAuth);
passport.use(passportMiddleware.GithubAuth);
passport.use(passportMiddleware.TwitterAuth);
passport.use(passportMiddleware.FacebookAuth);

/* routes */
app.use('/api-docs', middleSwaggers);
app.use('/api', rootRoutes);
app.use('/auth', PassportRoutes);

app.use(notFound);
app.use(errHandler);
/* connectDb */
connectDb();

/* listen */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.get("/payment",(res,req)=>{
  res.sendFile(__dirname+"/thanhtoan.html");
})
