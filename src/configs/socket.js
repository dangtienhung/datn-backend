import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const Message = mongoose.model('Message', {
  text: String,
  username: String,
});

export default (io) => {
  io.on('connection', async (socket) => {
    console.log('User connected');
    socket.on('join', (username) => {
      socket.username = username;
      console.log(`${username} joined`);

      // Gửi thông báo cho tất cả người dùng trong phòng
      io.emit('user joined', `${username} joined the chat`);
    });

    socket.on('chat message', async (message) => {
      console.log('Message:', message);

      // Lưu tin nhắn vào MongoDB
      const newMessage = new Message({ text: message.text, username: socket.username });
      await newMessage.save();

      // Gửi tin nhắn tới tất cả người dùng trong phòng
      io.emit('chat message', { text: message.text, username: socket.username });
    });

    async function getAllOrder(options) {
      try {
        await axios
          .get(`${process.env.HTTP}/api/orders?_page=${options.page}&_limit=${options.limit}`)
          .then((res) => {
            io.emit('server:loadAllOrder', res['data']);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    async function getCancelOrder(options) {
      try {
        await axios
          .get(
            `${process.env.HTTP}/api/order-canceled?_limit=${
              options?.limit ? options.limit : 10
            }&_page=${options?.page ? options.page : 1}&startDate=${
              options?.startDate ? options.startDate : ''
            }&endDate=${options?.endDate ? options.endDate : ''}`
          )
          .then((res) => {
            io.emit('server:loadCancelOrder', res['data']);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    async function getPendingOrder(options) {
      try {
        await axios
          .get(
            `${process.env.HTTP}/api/order-pending?_limit=${
              options?.limit ? options.limit : 10
            }&_page=${options?.page ? options.page : 1}&startDate=${
              options?.startDate ? options.startDate : ''
            }&endDate=${options?.endDate ? options.endDate : ''}`
          )
          .then((res) => {
            io.emit('server:loadPendingOrder', res['data']);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    // await getPendingOrder();

    async function getDeliveredOrder(options) {
      try {
        await axios
          .get(
            `${process.env.HTTP}/api/order-delivered?_limit=${
              options?.limit ? options.limit : 10
            }&_page=${options?.page ? options.page : 1}&startDate=${
              options.startDate ? options.startDate : ''
            }&endDate=${options?.endDate ? options.endDate : ''}`
          )
          .then((res) => {
            io.emit('server:loadDeliveredOrder', res['data']);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    async function getConfirmedOrder(options = '') {
      try {
        // console.log(options);
        await axios
          .get(
            `${process.env.HTTP}/api/order-confirmed?_limit=${
              options?.limit ? options.limit : 10
            }&_page=${options?.page ? options.page : 1}&startDate=${
              options.startDate ? options.startDate : ''
            }&endDate=${options?.endDate ? options.endDate : ''}`
          )
          .then((res) => {
            io.emit('server:loadConfirmedOrder', res['data']);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    async function getDoneOrder(options) {
      try {
        await axios
          .get(
            `${process.env.HTTP}/api/order-done?_limit=${
              options?.limit ? options.limit : 10
            }&_page=${options?.page ? options.page : 1}&startDate=${
              options?.startDate ? options.startDate : ''
            }&endDate=${options?.endDate ? options.endDate : ''}`
          )
          .then((res) => {
            io.emit('server:loadDoneOrder', res['data']);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    socket.on('client:requestAllOrder', async (data) => {
      await getAllOrder(data);
    });

    socket.on('client:requestCancelOrder', async (options) => {
      await getCancelOrder(options);
    });

    socket.on('client:requestPendingOrder', async (options) => {
      await getPendingOrder(options);
    });

    socket.on('client:requestDeliveredOrder', async (options) => {
      await getDeliveredOrder(options);
    });

    socket.on('client:requestConfirmedOrder', async (options) => {
      await getConfirmedOrder(options);
    });

    socket.on('client:requestDoneOrder', async (options) => {
      console.log('doneOrder', options);
      await getDoneOrder(options);
    });

    socket.on('client:cancelOrder', async (id) => {
      try {
        await axios
          .put(`${process.env.HTTP}/api/order/canceled/${id}`)
          .then(async () => {
            await getCancelOrder();
            await getPendingOrder();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('client:pendingOrder', async (id) => {
      try {
        await axios
          .put(`${process.env.HTTP}/api/order/pending/${id}`)
          .then(() => {
            getPendingOrder();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('client:doneOrder', async (id) => {
      try {
        await axios
          .put(`${process.env.HTTP}/api/order/done/${id}`)
          .then(async () => {
            await getDoneOrder();
            await getConfirmedOrder();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('client:confirmedOrder', async (id) => {
      try {
        await axios
          .put(`${process.env.HTTP}/api/order/confirmed/${id}`)
          .then(async () => {
            await getConfirmedOrder();
            await getPendingOrder();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('client:deliveryOrder', async (id) => {
      try {
        await axios
          .put(`${process.env.HTTP}/api/order/delivered/${id}`)
          .then(async () => {
            await getDeliveredOrder();
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('disconnect', () => {
      console.log('User disconnected');
      //     // Gửi thông báo cho tất cả người dùng trong phòng
      //     io.emit('user left', `${socket.username} left the chat`);
    });
  });
};
