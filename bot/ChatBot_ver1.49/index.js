const socketIo = require('socket.io');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const io = socketIo(server);
const { ObjectId } = require('mongodb');
const { NlpManager } = require('node-nlp');
const multer = require('multer');
const xlsx = require('xlsx');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(
  cors({
    origin: 'http://localhost:5173', // or '*' for a less secure option that allows all origins
  })
);
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
    createdAt:String,
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
const trained = mongoose.model('trained',mongoose.Schema({
    data: String,
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
app.get('/ask', async (req, res) => {
  const { query,id } = req.query;
  const allData=await trained.findOne({});
  await manager.import(allData.data);

  if (query) {
    let response = await manager.process('vi', query);
    // console.log(response)
    if(response.intent=='bought_num' && (!id ||id=="")){
      return res.json({answer:"Bạn cần phải đăng nhập để xem mục này !"})
    }
    // lastest_buy
    else if(response.intent=='lastest_buy'){
      const _id= new mongoose.Types.ObjectId(id);
      const documents = await checkouts.find({user:_id});
      console.log(documents[0].createdAt)
      return res.json({
        answer:`lần cuối bạn mua hàng là ${documents[0].createdAt} `
      })
    }
    else if(response.intent=='bought_num'){
      const _id= new mongoose.Types.ObjectId(id);
      // mongoose.Types.ObjectId(id);
      const documents = await checkouts.find({user:_id});
      return res.json({
        answer:`bạn đã mua ${documents.length} đơn hàng`
      })
    }
    return res.json({ answer: response.answer });
  }
});
app.get('/admin',async (req,res)=>{
  res.sendFile(__dirname+'/add.html')
})
const pre_training = mongoose.model('pre_training',mongoose.Schema({
  class: String,
  answer:String,
  question:String,
})
);
app.get('/api/loadAll',async (req,res)=>{
  const p=await pre_training.find({});
  var json={};
  var onClass=[];

  for(const x of p){
    onClass.push(x.class);

    if(json[x.class]!==undefined){
      json[x.class]['answer'].push(x.answer)
      json[x.class]['question'].push(x.question)
    }
    else{
      json={...json,...{
        [x.class]:{
          "answer":[x.answer],
          "question":[x.question],
        }
      }}
    }
  }
  const {c}=req.query;
  if(c)return res.json(onClass)
  res.json(json);
})
app.get('/api/add',async (req,res)=>{
  const {answer,classs,question}=req.query;
  await pre_training({
    class:classs,
    answer:answer,
    question:question
  }).save();

  res.json({status:true})
})
app.get('/api/delete',async (req,res)=>{
  const {question}=req.query;
  await pre_training.deleteOne({question:question})
  res.json({status:true})

})
app.get('/api/train',async (req,res)=>{
  const p=await pre_training.find({});

  for(const v of p){
    manager.addDocument('vi',`${v.question}`,`${v.class}`);
    manager.addAnswer('vi',`${v.class}`,`${v.answer}`);
    manager.train();
    manager.save();
  }
  const ex=manager.export();
  await trained.deleteMany({});
  await trained({
    data:ex,
  }).save()
  res.json({status:true})


})

app.post('/upload', upload.single('file'), async(req, res) => {
  if (!req.file) {
    res.status(400).send('cần upload file');
    return;
  }

  // Đọc dữ liệu từ tệp .xlsx
  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

  // Chuyển đổi dữ liệu sang định dạng JSON
  const result = {};
  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    result[sheetName] = xlsx.utils.sheet_to_json(sheet);
  });
  const allData=await trained.findOne({});
  manager.import(allData.data);
  for(const v of result.Sheet1){
    manager.addDocument('vi',`${v.question}`,`${v.class}`);
    manager.addAnswer('vi',`${v.class}`,`${v.answer}`);
    manager.train();
    manager.save();
  }
  const ex=manager.export();
  await trained.deleteMany({});
  await trained({
    data:ex,
  }).save()
  res.json(result);
});
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

server.listen(3333, () => {
  console.log('Server đang lắng nghe trên cổng 3333');
});