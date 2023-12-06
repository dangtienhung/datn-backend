import * as dotenv from 'dotenv';

import { errHandler, notFound } from './middlewares/errhandle.js';
import Coins from './models/coin.js';
import PassportRoutes from './routes/passport.routes.js';
import { Server as SocketIo } from 'socket.io';
import User from './models/user.model.js';
import compression from 'compression';
import { connectDb } from './configs/index.js';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import http from 'http';
import jwt from 'jsonwebtoken';
import middleSwaggers from './docs/index.js';
import morgan from 'morgan';
import passport from 'passport';
import passportMiddleware from './middlewares/passport.middlewares.js';
import path from 'path';
import rootRoutes from './routes/index.js';
import session from 'express-session';
import socket from './configs/socket.js';
import { ppid } from 'process';
// import Orders from './models/order.model.js';
// import Order from './models/order.model.js';

//lấy  jwt

dotenv.config();

/* config */

//Setup dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//file name html
//

const app = express();

app.get('/', (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');

  const refreshTokenCookie = cookies.refreshToken;
  if (refreshTokenCookie) {
    try {
      const decoded = jwt.verify(refreshTokenCookie, process.env.SECRET_REFRESH);

    } catch (err) {
      console.error('Invalid token:', err.message);
    }


    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Refresh Token: ' + refreshTokenCookie);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Refresh Token not found');
  }
});

app.use(morgan('common'));
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

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
app.use(helmet());
app.use(compression());
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

/* routes */
app.use('/api-docs', middleSwaggers);
app.use('/api', rootRoutes);
app.use('/auth', PassportRoutes);
//
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/voucher.html');
});

app.get('/api/new_voucher', async (req, res) => {
  const { coin, name } = req.query;
  const check = await Coins.findOne({ name });
  if (check) return res.json({ msg: 'Mã đã tồn tại' });
  else {
    await Coins({
      name: name,
      money: coin,
    }).save();
  }
});
app.get('/api/find_voucher', async (req, res) => {
  const { name } = req.query;
  const check = await Coins.findOne({ name });
  if (!check) return res.json({ msg: 'Mã không tồn tại' });
  else {
    return res.json({ msg: `số dư: ${check.money}` });
  }
});
app.get('/api/edit_voucher', async (req, res) => {
  const { name, coin } = req.query;
  const check = await Coins.findOne({ name });
  if (!check) return res.json({ msg: 'Mã không tồn tại' });
  else {
    const lt = check.money * 1 + coin * 1;
    await Coins.updateOne({ _id: check._id }, { $set: { money: lt } });
    return res.json({ msg: `Update thành công số dư: ${lt}` });
  }
});

// thống kê


app.use(notFound);
app.use(errHandler);

/* connectDb */
connectDb();

/* listen */
const port = process.env.PORT || 5000;

//Chat

const server = http.createServer(app);
const io = new SocketIo(server);
server.listen(port, async () => {
  try {
    socket(io);
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.log(error);
  }
});


