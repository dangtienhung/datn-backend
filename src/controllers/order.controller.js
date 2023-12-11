import dotenv from 'dotenv';
import { generatePaymentToken } from '../configs/token.js';
import Cart from '../models/cart.model.js';
import Order from '../models/order.model.js';
import Voucher from '../models/voucher.model.js';
import { orderValidate } from '../validates/order.validate.js';
import { sendEmailOrder } from './nodeMailer.controllers.js';
dotenv.config();

export const orderController = {
  /* create */
  create: async (req, res) => {
    try {
      const body = req.body;
      const note = {
        user: body.user,
        noteOrder: body.noteOrder,
        noteShipping: body.inforOrderShipping.noteShipping,
      };
      const encodeStripe = generatePaymentToken(note);
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
      let totalAll = 0
      const priceShipping = Number(body.priceShipping) || 0;
      // check _id or phone user
      const userUsedVoucher = body.inforOrderShipping.phone
      // check voucher đã đc dùng hay chưa
      if (body?.moneyPromotion?.voucherId) {

        const checkVoucher = await Voucher.findById({ _id: body.moneyPromotion.voucherId })

        if (!checkVoucher) {
          return res.status(400).json({ error: 'Không tìm thấy mã voucher' });
        }

        if (checkVoucher.discount == 0) {
          return res.status(400).json({ error: 'Voucher đã hết lượt dùng!' });
        }
        const exitUser = checkVoucher.user_used.includes(userUsedVoucher);
        if (exitUser) {
          return res.status(400).json({ error: 'Đã hết lượt dùng Voucher' });
        }

        checkVoucher?.user_used.push(userUsedVoucher)
        checkVoucher.discount--
        await checkVoucher.save()

        const moneyPromotion = body.moneyPromotion?.price ? body.moneyPromotion?.price : 0
        const totalPricePr = total + priceShipping - Number(moneyPromotion)
        totalAll = totalPricePr <= 0 ? 0 : totalPricePr
      }
      else {
        totalAll = total + priceShipping
      }


      /* tạo đơn hàng mới */
      const order = new Order({
        ...body,
        total: totalAll,
        priceShipping: body.priceShipping,
        is_active: true,
        isPayment: ['vnpay', 'stripe'].includes(body.paymentMethodId) ? true : false,
      });

      const dataEmail = {
        items,
        userInfo: body.inforOrderShipping,
        priceShipping: body.priceShipping,
        total: totalAll,
        to: body.email,
        text: 'Hi!',
        subject: 'cảm ơn bạn đã đặt hàng tại Trà sữa Connect',

      };
      await sendEmailOrder(dataEmail)
      /* lưu đơn hàng mới */
      const orderNew = await order.save();
      if (!orderNew) {
        return res.status(400).json({ error: 'Tạo đơn hàng thất bại' });
      }

      const cart = await Cart.deleteMany({
        user: order.user,
      });

      if (!cart) {
        return res.status(200).json({
          message: 'delete success',
          data: cart,
        });
      }

      return res.status(200).json({
        message: 'create order successfully',
        order: {
          orderNew,
          url: `${process.env.RETURN_URL}/products/checkout/payment-result?encode=${encodeStripe}`,
        },
      });
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
          { path: 'moneyPromotion.voucherId' },
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
          path: 'moneyPromotion.voucherId',
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
      const { reasonCancelOrder } = req.body;
      if (reasonCancelOrder == '') {
        return res.status(500).json({ error: 'Đề nghị bạn cho lý do hủy đơn' });
      }

      const orderCanceled = await Order.findByIdAndUpdate(
        id,
        {
          status: 'canceled',
          reasonCancelOrder: reasonCancelOrder,
        },
        { new: true }
      ).populate([
        {
          path: 'user',
          select: '-password -products -order',
          populate: { path: 'role', select: '-users' },
        },
        { path: 'items.product' },
      ]);

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
      const { _page = 1, _limit = 10, q, startDate, endDate } = req.query;
      /* các điều kiện cần */
      const options = {
        page: _page,
        limit: _limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'user', select: '_id googleId username avatar' },
          { path: 'items.product', select: '_id name sale' },
          { path: 'moneyPromotion.voucherId', },
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

      if ((startDate && !endDate) || (startDate && endDate)) {
        const targetDate = new Date(startDate);

        targetDate.setHours(0, 0, 0, 0);
        const targetEndDate = new Date(targetDate);
        targetEndDate.setHours(23, 59, 59, 999);
        if (startDate > endDate) {
          return res.status(500).json({ error: 'startDate không lớn hơn endDate' });
        }
        const searchQuery = {
          createdAt: {
            $gte: targetDate,
            $lt: endDate ? endDate : targetEndDate,
          },
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

  /* lấy ra đơn hàng theo user id */
  getAllOrderByUserId: async (req, res) => {
    try {
      // const { _page = 1, _limit = 10, q } = req.query;
      const { id } = req.params;
      // const options = {
      //   page: _page,
      //   limit: _limit,
      //   sort: { createdAt: -1 },
      //   populate: [
      //     { path: 'user', select: 'username avatar account' },
      //     { path: 'items.product', select: 'name' },
      //   ],
      // };
      // const query = q ? { name: { $regex: q, $options: 'i' } } : {};
      // const orders = await Order.paginate({ user: id, ...query }, options);
      const orders = await Order.find({ user: id });
      if (!orders) {
        return res.status(400).json({ error: 'get all order by user id failed' });
      }
      return res.status(200).json([...orders]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
