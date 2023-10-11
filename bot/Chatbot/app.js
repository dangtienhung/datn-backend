const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Xử lý yêu cầu từ người dùng
app.post("/chat", (req, res) => {
  const userMessage = req.body.message;
  // Sử dụng mô hình chatbot để trả lời userMessage
  const chatbotResponse = yourChatbotModel(userMessage);

  res.json({ response: chatbotResponse });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
