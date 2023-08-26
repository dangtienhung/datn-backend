import express from 'express';
import http from 'http';
import { Server as SocketIo } from 'socket.io';
import mongoose from 'mongoose';
import User from './src/models/user.model.js';
//
import { json } from 'express';
import session from 'express-session';
import  jwt  from 'jsonwebtoken';
import cookie from 'cookie'
//phần Setup dirname

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//
const app = express();
const server = http.createServer(app);
const io = new SocketIo(server);


//
var JWTusername="";
app.get('/livechat', (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const refreshTokenCookie = cookies.refreshToken;
  if (refreshTokenCookie) {
    try {
      const decoded = jwt.verify(refreshTokenCookie, "ReFreshSeCret");
      JWTusername=decoded.username;
      // console.log(decoded);
    } catch (err) {
      console.error('Invalid token:', err.message);
    }
  }
  
  res.sendFile(__dirname + '/livechat.html');
});
const Message = mongoose.model('Message', {
  text: String,
  username: String,
  reciever:String,
  seen:String,
  timestamp: { type: Date, default: Date.now }

});
//
mongoose.connect('mongodb+srv://hungdang02042003:jVp9aHU2eqE747nE@du-an-framework2-milk-t.ntg5d7s.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// async function getChat(username) {
//   try {
//     const chats =  await Message.find({username,reciever:"toAdmin"}).sort({ timestamp: 'asc'  });
//     return ((chats));
//   } catch (error) {
//     console.error('Error querying data:', error);
//   }
// }

io.on('connection',async socket => {
  
  //mặc định
  const chats =  await Message.find({username:JWTusername}).sort({ timestamp: 'asc'  });
  

  socket.on('join', () => {
    socket.username = JWTusername;
  });
  socket.on('UpdateChatSeen', async (username) => {
    const result = await Message.updateMany({ username: username }, { $set: { seen: 'yes' } });

  });

  socket.on("chatMsg", async message => {
    // console.log('Message:', message);
    const newMessage = new Message({ text: message.text, username: JWTusername,reciever:"toAdmin",seen:"no" });
    await newMessage.save();
    io.emit("chatMsg", { text: message.text, username: message.username ,to:"toAdmin"});

    io.emit("AdminMsg", { text: message.text, username: JWTusername ,to:("to"+JWTusername)});
    //
    io.emit("UpdateUserListMsg",{username: message.username});

  });
  socket.on("AdminMsg", async message => {
    const newMessage = new Message({ text: message.text, username: JWTusername,reciever:"to"+message.username,seen:"no" });
    await newMessage.save();
    io.emit("chatMsg", { text: message.text, username: JWTusername ,to:("to",message.username)});
    
    
    io.emit("AdminMsg", { text: message.text, username: JWTusername ,to:"toAdmin"});
  });
  // io.emit("adminSend", { text: "1", username: "kous1608" ,to:"toAdmin"});



  // socket.on('disconnect', () => {
  //   console.log(`${JWTusername} offline`);
  // });
});
app.get('/admin/chat', async (req, res) => {
  const user=req.query.username;
  const result = await Message.updateMany({ username: user }, { $set: { seen: 'yes' } });
  res.sendFile(__dirname + '/adminchat.html');
})
app.get("/clientChat", async (req,res)=>{
    const chats =  await Message.find().sort({ timestamp: 'asc'  });
    res.json(chats)
})

app.get("/session", async (req,res)=>{
  const cookies = cookie.parse(req.headers.cookie || '');
  const refreshTokenCookie = cookies.refreshToken;
  if (refreshTokenCookie) {
      const decoded = jwt.verify(refreshTokenCookie, "ReFreshSeCret");
      JWTusername=decoded.username;
      res.json(decoded)
  }

})

app.get("/UniUser", async (req,res)=>{
  const uniqueUsernames = await Message.aggregate([
    {
      $match: {
        seen: 'no'
      }
    },
    {
      $group: {
        _id: "$username",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        username: "$_id",
        count: 1
      }
    }
  ]);
  res.json(uniqueUsernames)


})

server.listen(3000,(req,res)=>{
  console.log("Chạy server Livechat thành công !");
})

