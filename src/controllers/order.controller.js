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
      /* kiểm tra xem đã có order nào chưa */
      const orderExits = await Order.findOne({ user: body.user, status: 'pending' });
      if (!orderExits) {
        const items = body.items;
        /* tính tổng tiền của đơn hàng người dùng vừa đặt */
        const total = items.reduce((total, item) => {
          const price = Number(item.price) * Number(item.quantity);
          return total + price;
        }, 0);
        const priceShipping = Number(body.priceShipping) || 0;
        /* tạo đơn hàng mới */
        const order = new Order({
          user: body.user,
          items,
          status: 'pending',
          total: total + priceShipping,
          priceShipping: body.priceShipping,
          address: body.address,
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
        const productExits = body.items.find((x) => x.product === item.product);
        if (productExits) {
          /* nếu đã tồn tại thì cập nhật lại số lượng và giá tiền */
          item.quantity = productExits.quantity + item.quantity;
          item.price = productExits.price + item.price;
          const total = orderExits.items.reduce((total, item) => {
            const price = Number(item.price) * Number(item.quantity);
            return total + price;
          });
          const priceShipping = Number(body.priceShipping) || 0;
          orderExits.total = Number(total) + Number(priceShipping);
          orderExits.priceShipping = body.priceShipping;
          orderExits.address = body.address;
          /* lưu lại order */
          const orderUpdate = await orderExits.save();
          if (!orderUpdate) {
            return res.status(400).json({ error: 'update order failed' });
          }
          return res.status(200).json({ message: 'update order successfully', order: orderUpdate });
        } else {
          /* nếu chưa tồn tại thì thêm sản phẩm đó vào order */
          orderExits.items.push({
            product: item.product,
            quantity: item.quantity,
            price: item.price,
          });
        }
        const total = orderExits.items.reduce((total, item) => {
          const price = Number(item.price) * Number(item.quantity);
          return total + price;
        });
        const priceShipping = Number(body.priceShipping) || 0;
        orderExits.total = total + priceShipping;
        orderExits.priceShipping = body.priceShipping;
        orderExits.address = body.address;
        /* lưu lại order */
        const orderUpdate = await orderExits.save();
        if (!orderUpdate) {
          return res.status(400).json({ error: 'update order failed' });
        }
        return res.status(200).json({ message: 'update order successfully', order: orderUpdate });
      }
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
        populate: [{ path: 'user' }],
      };
      const query = q ? { name: { $regex: q, $options: 'i' } } : {};
      const orders = await Order.paginate(query, options);
      if (!orders) {
        return res.status(400).json({ error: 'get all order failed' });
      }
      return res.status(200).json({ message: 'get all order successfully', ...orders });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
