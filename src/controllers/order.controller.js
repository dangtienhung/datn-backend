import Order from '../models/order.model.js';
import { orderValidate } from '../validates/order.validate.js';
// import axios from 'axios';

export const orderController = {
  /* create */
  create: async (req, res) => {
    try {
      const body = req.body;
      //gửi mail
      // var message="Mua hàng thành công";
      // var subject="Payment Success";
      // var email=body['inforOrderShipping']['email'];
      // console.log(email)
      // var link=""
      // axios.get('https://ketquaday99.com/api/NodeMailer/?email='+email+'&subject='+subject+'&message='+message).then(function (response) {console.log(response);});

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
        {
          path: 'items.product',
          select: '-toppings -sizes -is_deleted -createdAt -updatedAt',
          populate: {
            path: 'category',
            select: '-products -is_deleted -createdAt -updatedAt',
          },
        },
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
          { path: 'user', select: '_id googleId username avatar' },
          { path: 'items.product', select: '_id name sale' },
        ],
      };
      /* chức năng tìm kiếm đơn hàng */
      let query = { status };
      if (q) {
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
