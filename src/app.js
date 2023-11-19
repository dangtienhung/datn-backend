import * as dotenv from 'dotenv';

import { errHandler, notFound } from './middlewares/errhandle.js';

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
    console.log('deser', id);
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
app.get('/home',(req,res)=>{
  res.sendFile(__dirname+"/voucher.html");
})
import  Coins from "./models/coin.js";
app.get('/api/new_voucher',async(req,res)=>{
  const {coin,name}=req.query;
  const check=await Coins.findOne({name});
  if(check)return res.json({msg:"Mã đã tồn tại"});
  else{
    await Coins({
      name:name,
      money:coin,
    }).save()
  }
})
app.get('/api/find_voucher',async(req,res)=>{
  const {name}=req.query;
  const check=await Coins.findOne({name});
  if(!check)return res.json({msg:"Mã không tồn tại"});
  else{
    return res.json({msg:`số dư: ${check.money}`})
  }
})
app.get('/api/edit_voucher',async(req,res)=>{
  const {name,coin}=req.query;
  const check=await Coins.findOne({name});
  if(!check)return res.json({msg:"Mã không tồn tại"});
  else{
    const lt=check.money*1+coin*1;
    await Coins.updateOne({_id:check._id},{$set:{money:lt}})
    return res.json({msg:`Update thành công số dư: ${lt}`})
  }
})
import Orders from "./models/order.model.js";
import Order from './models/order.model.js';
import Product from './models/product.model.js';
app.get('/api/analyst',async (req,res)=>{
  //doanh thu
  var doanh_thu=0;
  const currentDate = new Date();const currentMonth = currentDate.getMonth() + 1; const currentYear = currentDate.getFullYear();
  const result=await Orders.find({
    $expr: {
      $and: [
        { $eq: [{ $year: '$createdAt' }, currentYear] },
        { $eq: [{ $month: '$createdAt' }, currentMonth] },
      ]
    }
  })
  const vvv=await Orders.aggregate([
    {
      $project: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        total:'$total',
        status:'$status',
      }
  }]);
  var list_doanhthu={};
  for(const v of vvv){
    if(v.status=='canceled')continue;
    if(list_doanhthu["tháng "+v.month]==undefined)list_doanhthu={...list_doanhthu,...{["tháng "+v.month]:{count:1,money:v.total}}};
    else list_doanhthu["tháng "+v.month]={count:list_doanhthu["tháng "+v.month].count+1,money:list_doanhthu["tháng "+v.month].money+v.total};
  }
  
  
  
 
  var all_dth=0;
  const all_dt=await Order.find({});
  for(const v of all_dt)if(v.status!="canceled")all_dth+=v.total;
  var sold_product={};
  var m_product={count:0,name:""};
  for(const v of result){
    console.log(v.createdAt)
    if(v.status!="canceled")doanh_thu+=v.total;//doanh thu
    // mặt hàng bán đc 
    for(const c of v.items){
      if(sold_product[c.name]==undefined)sold_product={...sold_product,...{[c.name]:1}}
      else  sold_product[c.name]=sold_product[c.name]+1 ;
      if(m_product.count<sold_product[c.name])m_product={count:sold_product[c.name],name:c.name};
    }
    
  }
  //số user mới
  const nUs=await Coins.find({$expr: {
    $and: [
      { $eq: [{ $year: '$createdAt' }, currentYear] },
      { $eq: [{ $month: '$createdAt' }, currentMonth] }
    ]
  }})
  const all_nUs=await Coins.find({})
  //mặt hàng bán chạy

  


  res.json({
    "doanh thu tháng này":{
      "tháng này":doanh_thu,
      "tổng doanh thu":all_dth,
      "số đơn":list_doanhthu,
    },
    "số user tham gia":{
      "tháng này":nUs.length,
      "tổng":all_nUs.length,
    },
    "mặt hàng bán chạy tháng này":{
      "sản phẩm bán nhiều nhất":m_product,
      "danh sách ":sold_product
    }

  });
})


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
