const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3333;
const allowedOrigins = ['http://localhost:5173', "https://milk-tea-connect.click", "https://sub.milk-tea-connect.click/", "https://admin.milk-tea-connect.click/", "http://103.57.221.160:8000", "http://103.57.221.160:3333"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }

}));
app.use(bodyParser.json());

// Xử lý yêu cầu từ người dùng
app.post('/chat', (req, res) => {
  const userMessage = req.body.message;
  // Sử dụng mô hình chatbot để trả lời userMessage
  const chatbotResponse = yourChatbotModel(userMessage);

  res.json({ response: chatbotResponse });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
