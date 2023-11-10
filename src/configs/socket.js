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
    // data có thể là username hoặc id user phụ thuộc vào trường hợp
    socket.on('join', (data) => {
      socket.username = data;
      socket.join(data);
      // socket.broadcast.emit('somone one joined');
      console.log(`${data} joined`);

      // Gửi thông báo cho tất cả người dùng trong phòng
      io.emit('user joined', `${data} joined the chat`);
    });

    socket.on('chat message', async (message) => {
      console.log('Message:', message);

      // Lưu tin nhắn vào MongoDB
      const newMessage = new Message({ text: message.text, username: socket.username });
      await newMessage.save();

      // Gửi tin nhắn tới tất cả người dùng trong phòng
      io.emit('chat message', { text: message.text, username: socket.username });
    });

    async function getOrderUser(option) {
      try {
        await axios.get(`${process.env.HTTP}/api/order-user/${option.room}`).then((res) => {
          io.emit('server:loadOrderUser', res['data']);
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function getCancelOrder(options = '') {
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
            if (options.room) {
              io.in(options.room).emit('server:loadCancelOrder', res['data']);
            } else {
              socket.broadcast.emit('server:loadCancelOrder', res['data']);
              socket.emit('server:loadCancelOrder', res['data']);
            }
            options.room
              ? io.in(options.room).emit('server:loadCancelOrder', res['data'])
              : socket.emit('server:loadCancelOrder', res['data']);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    async function getPendingOrder(options = '') {
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
            if (options.room) {
              io.in(options.room).emit('server:loadPendingOrder', res['data']);
            } else {
              socket.broadcast.emit('server:loadPendingOrder', res['data']);
              socket.emit('server:loadPendingOrder', res['data']);
            }
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
        await axios
          .get(
            `${process.env.HTTP}/api/order-confirmed?_limit=${
              options?.limit ? options.limit : 10
            }&_page=${options?.page ? options.page : 1}&startDate=${
              options.startDate ? options.startDate : ''
            }&endDate=${options?.endDate ? options.endDate : ''}`
          )
          .then((res) => {
            if (options.room) {
              io.in(options.room).emit('server:loadConfirmedOrder', res['data']);
            } else {
              socket.broadcast.emit('server:loadConfirmedOrder', res['data']);
              socket.emit('server:loadConfirmedOrder', res['data']);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    async function getDoneOrder(options = '') {
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
            if (options.room) {
              io.in(options.room).emit('server:loadDoneOrder', res['data']);
            } else {
              socket.broadcast.emit('server:loadDoneOrder', res['data']);
              socket.emit('server:loadDoneOrder', res['data']);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    }

    socket.on('client:requestOrderUser', async (options) => {
      await getOrderUser(options);
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
      await getDoneOrder(options);
    });

    socket.on('client:cancelOrder', async (id) => {
      try {
        await axios
          .put(`${process.env.HTTP}/api/order/canceled/${id}`)
          .then(async (res) => {
            if (res['data'].order.user?._id) {
              await getOrderUser({ room: res['data'].order.user._id });
            }
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

    socket.on('client:createOrder', async (data) => {
      try {
        if (data) {
          await getOrderUser({ room: data });
        }
        await getPendingOrder();
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('client:pendingOrder', async (id) => {
      try {
        await axios
          .put(`${process.env.HTTP}/api/order/pending/${id}`)
          .then(async (res) => {
            if (res['data'].order.user?._id) {
              await getOrderUser({ room: res['data'].order.user._id });
            }
            await getPendingOrder();
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
          .then(async (res) => {
            if (res['data'].order.user?._id) {
              await getOrderUser({ room: res['data'].order.user._id });
            }
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
          .then(async (res) => {
            if (res['data'].order.user?._id) {
              await getOrderUser({ room: res['data'].order.user._id });
            }
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

    socket.on('disconnect', () => {
      console.log('User disconnected');
      // Gửi thông báo cho tất cả người dùng trong phòng
      io.emit('user left', `${socket.username} left the chat`);
    });
  });
};
