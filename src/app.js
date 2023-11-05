import * as dotenv from 'dotenv';

import { errHandler, notFound } from './middlewares/errhandle.js';

import PassportRoutes from './routes/passport.routes.js';
import { Server as SocketIo } from 'socket.io';
import User from './models/user.model.js';
import Users from './models/user.model.js'; // chat
import { authController } from './controllers/auth.controller.js'; // chat
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
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import passportMiddleware from './middlewares/passport.middlewares.js';
import path from 'path';
import rootRoutes from './routes/index.js';
import session from 'express-session';
import socket from './configs/socket.js';
import { userController } from './controllers/user.controllers.js'; // chat

//

//lấy  jwt

dotenv.config();

/* config */

//Setup dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//file name html
//

const app = express();

// app.use((req, res, next) => {
//   res.append('Access-Control-Allow-Origin', ['*']);
//   res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.append('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

app.get('/', (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');

  const refreshTokenCookie = cookies.refreshToken;
  if (refreshTokenCookie) {
    try {
      const decoded = jwt.verify(refreshTokenCookie, process.env.SECRET_REFRESH);
      console.log(decoded);
    } catch (err) {
      console.error('Invalid token:', err.message);
    }

    // console.log('Refresh Token:', refreshTokenCookie);

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

app.use(notFound);
app.use(errHandler);
/* connectDb */
connectDb();
// mongoose
// .connect(
// 'mongodb+srv://hungdang02042003:jVp9aHU2eqE747nE@du-an-framework2-milk-t.ntg5d7s.mongodb.net/?retryWrites=true&w=majority'
//   'mongodb://127.0.0.1:27017/be_du_an_tot_nghiep'
// )
// .then(() => console.log('Database connected!'))
// .catch((err) => console.log(err));

/* listen */
const port = process.env.PORT || 5000;
// app.listen(port, (req, res) => {
//   console.log(`Server is running on port ${port}`);
// });

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
// const io = new SocketIo(server);

// Tôi chuyển sang configs/socket.js cho gọn nhé
// io.on('connection', (socket) => {
//   console.log('User connected');

//   socket.on('join', (username) => {
//     socket.username = username;
//     console.log(`${username} joined`);

//     // Gửi thông báo cho tất cả người dùng trong phòng
//     io.emit('user joined', `${username} joined the chat`);
//   });

//   socket.on('chat message', async (message) => {
//     console.log('Message:', message);

//     // Lưu tin nhắn vào MongoDB
//     const newMessage = new Message({ text: message.text, username: socket.username });
//     await newMessage.save();

//     // Gửi tin nhắn tới tất cả người dùng trong phòng
//     io.emit('chat message', { text: message.text, username: socket.username });
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//     // Gửi thông báo cho tất cả người dùng trong phòng
//     io.emit('user left', `${socket.username} left the chat`);
//   });
// });
