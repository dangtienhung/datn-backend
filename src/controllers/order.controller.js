import Order from '../models/order.model.js';
import { orderValidate } from '../validates/order.validate.js';

export const orderController = {
  /* create */
  create: async (req, res) => {
    try {
      const body = req.body;
      /* validate */
      const { error } = orderValidate.validate(body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      const items = body.items;
      /* tính tổng tiền của đơn hàng người dùng vừa đặt */
      let total = 0;
      items.forEach((item) => {
        total += item.quantity * item.price;
        /* nếu mà sản phẩm có topping */
        if (item.toppings.length > 0 && item.toppings) {
          item.toppings.forEach((topping) => {
            total += topping.price;
          });
        }
      });
      /* kiểm tra xem đã có order nào chưa */
      const orderExits = await Order.findOne({ user: body.user, status: 'pending' });
      if (!orderExits) {
        const priceShipping = Number(body.priceShipping) || 0;
        /* tạo đơn hàng mới */
        const order = new Order({
          ...body,
          total: total + priceShipping,
          priceShipping: body.priceShipping,
          is_active: true,
        });
        /* lưu đơn hàng mới */
        const orderNew = await order.save();
        if (!orderNew) {
          return res.status(400).json({ error: 'create order failed' });
        }
        return res.status(200).json({ message: 'create order successfully', order: orderNew });
      }
      /* khi đã tồn tại order đó rồi */
      for (let item of orderExits.items) {
        /* kiểm tra xem sản phẩm đó đã tồn tại trong order chưa */
        const productExits = body.items.find((product) => {
          return item.product.toString() === product.product.toString();
        });
        if (productExits) {
          /* nếu sản phẩm tồn tại rồi thì check xem có trùng size không thì làm như nào */
          if (item.size._id === productExits.size._id) {
            /* nếu trùng size thì cộng thêm số lượng vào */
            item.quantity += productExits.quantity;
          } else {
            /* nếu không trùng size thì thêm sản phẩm đó vào order */
            orderExits.items.push({
              image: productExits.image,
              product: productExits.product,
              quantity: productExits.quantity,
              price: productExits.price,
              toppings: productExits.toppings,
              size: productExits.size,
            });
          }
          /* save lại sản phẩm */
          console.log(
            '🚀 ~ file: order.controller.js:113 ~ create: ~ orderExits.items',
            orderExits.items
          );
          return res.status(200).json({ message: 'create order successfully', order: orderExits });
        } else {
          /* nếu chưa tồn tại thì thêm sản phẩm đó vào order */
          orderExits.items.push({
            image: item.image,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            toppings: item.toppings,
            size: item.size,
          });
        }
        // const orderUpdate = await orderExits.save();
        // if (!orderUpdate) {
        //   return res.status(400).json({ error: 'update order failed' });
        // }
        // return res.status(200).json({ message: 'update order successfully', order: orderUpdate });
      }
      return res.status(200).json({ message: 'update order successfully' });
      /* kiểm tra xem sản phẩm đã có trong order chưa */
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  /* get all order */
  getAll: async (req, res) => {
    try {
      const { _page = 1, _limit = 10, q } = req.query;
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: [
          {
            path: 'user',
            select: '-password -products -order',
            populate: { path: 'role', select: '-users' },
          },
          { path: 'items.product' },
        ],
      };
      const query = q ? { name: { $regex: q, $options: 'i' } } : {};
      const orders = await Order.paginate(query, options);
      if (!orders) {
        return res.status(400).json({ error: 'get all order failed' });
      }
      return res.status(200).json({ ...orders });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* get order by id */
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id).populate([
        {
          path: 'user',
          select: '-password -products -order',
          populate: { path: 'role', select: '-users' },
        },
        { path: 'items.product' },
      ]);
      if (!order) {
        return res.status(400).json({ error: 'get order by id failed' });
      }
      return res.status(200).json({ order });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* cập nhật trạng thái đơn hàng */
  updateStatus: async (id, status) => {
    try {
      const updateState = await Order.findByIdAndUpdate(
        id,
        { status: status },
        { new: true }
      ).populate([
        {
          path: 'user',
          select: '-password -products -order',
          populate: { path: 'role', select: '-users' },
        },
        { path: 'items.product' },
      ]);
      if (!updateState) {
        return res.status(400).json({ error: 'update status order failed' });
      }
      return updateState;
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* cập nhật trạng thái đơn hàng thành confirmed */
  confirmOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const orderConfirm = await orderController.updateStatus(id, 'confirmed');
      if (!orderConfirm) {
        return res.status(400).json({ error: 'confirm order failed' });
      }
      return res.status(200).json({ message: 'confirm order successfully', order: orderConfirm });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* cập nhật trạng thái đơn hàng thành delivered */
  deliveredOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const orderDelivered = await orderController.updateStatus(id, 'delivered');
      if (!orderDelivered) {
        return res.status(400).json({ error: 'delivered order failed' });
      }
      return res
        .status(200)
        .json({ message: 'delivered order successfully', order: orderDelivered });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* cập nhật trạng thái đơn hàng thành canceled */
  canceledOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const orderCanceled = await orderController.updateStatus(id, 'canceled');
      if (!orderCanceled) {
        return res.status(400).json({ error: 'canceled order failed' });
      }
      return res.status(200).json({ message: 'canceled order successfully', order: orderCanceled });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* cập nhật trạng thái đơn hàng thành done */
  doneOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const orderDone = await orderController.updateStatus(id, 'done');
      if (!orderDone) {
        return res.status(400).json({ error: 'done order failed' });
      }
      return res.status(200).json({ message: 'done order successfully', order: orderDone });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* cập nhật trạng thái đơn hàng về penđing */
  pendingOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const orderPending = await orderController.updateStatus(id, 'pending');
      if (!orderPending) {
        return res.status(400).json({ error: 'pending order failed' });
      }
      return res.status(200).json({ message: 'pending order successfully', order: orderPending });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* xóa đơn hàng */
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const orderDelete = await Order.findByIdAndDelete(id);
      if (!orderDelete) {
        return res.status(400).json({ error: 'delete order failed' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* lấy ra các đơn hàng theo trạng thái */
  getOrderByStatus: async (req, res, status) => {
    try {
      const { _page = 1, _limit = 10, q } = req.query;
      /* các điều kiện cần */
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: '-password -products -order' },
          { path: 'items.product' },
        ],
      };
      /* chức năng tìm kiếm đơn hàng */
      let query = { status };
      if (q) {
        console.log('🚀 ~ file: order.controller.js:265 ~ getOrderByStatus: ~ q:', q);
        const searchQuery = {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { status: { $regex: q, $options: 'i' } },
            { address: { $regex: q, $options: 'i' } },
            { 'user.username': { $regex: q, $options: 'i' } },
            { 'user.email': { $regex: q, $options: 'i' } },
            { 'user.phone': { $regex: q, $options: 'i' } },
            { 'items.product.name': { $regex: q, $options: 'i' } },
          ],
        };
        query = { $and: [searchQuery, query] };
      }
      const orders = await Order.paginate(query, options);
      if (!orders) {
        return res.status(400).json({ error: `get all order ${status} failed` });
      }
      return res.status(200).json({ ...orders });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* lấy ra tất cả các đơn hàng có trạng thái là confirm */
  getAllOrderConfirmed: async (req, res) => {
    try {
      return orderController.getOrderByStatus(req, res, 'confirmed');
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* lấy ra tất cả các đơn hàng có trạng thái là delivered */
  getAllOrderDelivered: async (req, res) => {
    try {
      return orderController.getOrderByStatus(req, res, 'delivered');
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* lấy ra tất cả các đơn hàng có trạng thái là done */
  getAllOrderDone: async (req, res) => {
    try {
      return orderController.getOrderByStatus(req, res, 'done');
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* lấy ra tất cả các đơn hàng có trạng thái là canceled */
  getAllOrderCanceled: async (req, res) => {
    try {
      return orderController.getOrderByStatus(req, res, 'canceled');
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /* lấy ra tất cả các đơn hàng có trạng thái là penđing */
  getAllOrderPending: async (req, res) => {
    try {
      return orderController.getOrderByStatus(req, res, 'pending');
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
