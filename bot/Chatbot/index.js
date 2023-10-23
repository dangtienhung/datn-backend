const socketIo = require('socket.io');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const manager = require('./langchain.js');
//train model
manager.train().then(async () => {
  manager.save();
  //router

  // bot chat o port 3000
  app.get('/bot', async (req, res) => {
    let response = await manager.process('vi', req.query.message);
    res.json(response);

    //success

    // res.send(response.answer || 'Xin lỗi , thông tin không có sẵn , vui lòng chuyển sang câu hỏi khác');
  });
  // console.log( await manager.process('vi',"hello"));
  // app.listen(3000);//
});

//connect serrver
mongoose.connect(
  'mongodb+srv://hungdang02042003:jVp9aHU2eqE747nE@du-an-framework2-milk-t.ntg5d7s.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
//schema
const products = mongoose.model(
  'products',
  new mongoose.Schema({
    name: String,
    description: String,
    sale: Number,
    images: [
      {
        url: String,
      },
    ],
    description: String,
  })
);
const checkouts = mongoose.model(
  'checkouts',
  new mongoose.Schema({
    name: String,
    description: String,
    sale: Number,
    images: [
      {
        url: String,
      },
    ],
    description: String,
  })
);
const topping = mongoose.model(
  'toppings',
  new mongoose.Schema({
    name: String,
    price: Number,
  })
);
const FastOrder = mongoose.model(
  'FastOrder',
  new mongoose.Schema({
    text: String,
  })
);
app.get('/products', async (req, res) => {
  const documents = await products.find({});
  res.json(documents);
});
app.get('/checkouts', async (req, res) => {
  const documents = await checkouts.find({});
  res.json(documents);
});
app.get('/toppings', async (req, res) => {
  const documents = await topping.find({});
  res.json(documents);
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  socket.on('ChatMessage', async (message) => {
    let response = await manager.process('vi', message);
    io.emit('ChatMessage', message);
    io.emit(
      'ChatMessage',
      "<str style='color:green'>" +
        (response.answer ||
          'Xin lỗi ,shop chưa hiểu câu hỏi của bạn ,  bạn vui lòng hãy chat cụ thể hơn ạ 🥹  !') +
        '</str>'
    );
  });
  socket.on('Order', async (message) => {
    io.emit('ChatMessage', message);
    //
    new FastOrder({
      text: 'message',
    }).save();
    io.emit('ChatMessage', 'Đặt hàng thành công ! Shop cảm ơn bạn đã đặt hàng nè  ');
  });
});
server.listen(3009, () => {
  console.log('Server đang lắng nghe trên cổng 3000');
});
