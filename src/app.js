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
import Orders from './models/order.model.js';
import Order from './models/order.model.js';
 
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

app.get('/api/analyst', async (req, res) => {
  //doanh thu

  var doanh_thu = 0;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const result = await Orders.find({
    $expr: {
      $and: [
        { $eq: [{ $year: '$createdAt' }, currentYear] },
        { $eq: [{ $month: '$createdAt' }, currentMonth] },
      ],
    },
  });
  const vvv = await Orders.aggregate([
    {
      $project: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        total: '$total',
        status: '$status',
      },
    },
  ]);
  var list_doanhthu = {};
  for (const v of vvv) {
    if (v.status == 'canceled') continue;
    if (list_doanhthu['tháng ' + v.month] == undefined)
      list_doanhthu = {
        ...list_doanhthu,
        ...{ ['tháng ' + v.month]: { count: 1, money: v.total } },
      };
    else
      list_doanhthu['tháng ' + v.month] = {
        count: list_doanhthu['tháng ' + v.month].count + 1,
        money: list_doanhthu['tháng ' + v.month].money + v.total,
      };
  }
  // console.log(doanh_thu);
  var all_dth = 0;
  const all_dt = await Order.find({});
  for (const v of all_dt) if (v.status != 'canceled') all_dth += v.total;
  var sold_product = {};
  var m_product = { count: 0, name: '' };
  //
  for (const v of result) {
    // console.log(v.items, 'p');

    if (v.status != 'canceled') doanh_thu += v.total; //doanh thu
    // mặt hàng bán đc
    for (const c of v.items) {
      if (sold_product[c.name] === undefined)
        sold_product = { ...sold_product, ...{ [c.name]: 1 } };
      else sold_product[c.name] = sold_product[c.name] + 1;
      if (m_product.count < sold_product[c.name])
        m_product = { count: sold_product[c.name], name: c.name };
    }
  }
  //số user mới
  const nUs = await Coins.find({
    $expr: {
      $and: [
        { $eq: [{ $year: '$createdAt' }, currentYear] },
        { $eq: [{ $month: '$createdAt' }, currentMonth] },
      ],
    },
  });
  const all_nUs = await Coins.find({});
  //
  //vùng ngày
  const { fromDate, toDate, selectDate } = req.query;
  var AnaZone = [];
  if (fromDate && toDate) {
    var res1 = await Orders.find({
      createdAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    });
    if (selectDate) res1 = await Orders.find({ createdAt: new Date(selectDate) });
    //doanh thu tuần tự
    var dt_toDate = 0;
    var cancel_order_toDate = 0;
    var done_order_toDate = 0;
    var vnpay_toDate = 0;
    for (const value of res1) {
      dt_toDate += value.total; //dt
      if (value.status == 'canceled') cancel_order_toDate += 1;
      if (value.status == 'dont') done_order_toDate += 1;
      if (value.paymentMethodId == 'vnpay') vnpay_toDate += 1;
    }
    AnaZone = {
      'doanh thu vùng này': dt_toDate,
      'đơn hàng đã huỷ': cancel_order_toDate,
      'đơn hàng thành công': done_order_toDate,
      'trả tiền bằng vnpay': vnpay_toDate,
      'trả tiền bằng tiền mặt': res1.length - vnpay_toDate,
    };
  }
  //voucher
  const Vouchers = await Coins.find({});
  var total_voucher_money = 0;
  for (const v1 of Vouchers) total_voucher_money += v1.money;
  //user mua 2 đơn
  var userMap = {};
  var cUser2_Order = [];
  var c_ssUser2_Order = 0;
  var dt_ssUser2_Order = 0;
  for (const v of all_dt) {
    //lưu user mua  vào 1 map
    if (v.user == undefined) {
      dt_ssUser2_Order += v.total;
      c_ssUser2_Order++;
    } else if (userMap[v.user] == undefined && v.user != undefined)
      userMap = { ...userMap, ...{ [v.user]: 1 } };
    else userMap[v.user] = userMap[v.user] + 1;
  }
  for (const [key, value] of Object.entries(userMap))
    if (value >= 2) {
      const ass1_b = await User.findOne({ _id: key });
      cUser2_Order.push(ass1_b);
    }
  res.json({
    '*theo thời gian tuỳ ý': AnaZone,
    voucher: {
      'số lượng': Vouchers.length,
      'tổng tiền': total_voucher_money,
    },
    'doanh thu tháng này': {
      'tháng này': doanh_thu,
      'tổng doanh thu': all_dth,
      'số đơn': list_doanhthu,
      'doanh thu khách vãn lai ': dt_ssUser2_Order,
    },

    'số user tham gia': {
      'tháng này': nUs.length,
      'tổng ': all_nUs.length,
      'khách vãn lai': c_ssUser2_Order,
    },
    'mặt hàng bán chạy tháng này': {
      'sản phẩm bán nhiều nhất': m_product,
      'danh sách ': sold_product,
    },
    'user mua 2 đơn trở lên': cUser2_Order,
  });
});

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


