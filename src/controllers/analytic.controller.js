import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Voucher from '../models/voucher.model.js';

export const analyticController = {
  /* đếm số lượng voucher hiện có */
  countVoucher: async (req, res) => {
    try {
      const countVouchers = await Voucher.countDocuments(); /* lấy hết voucher đang có */
      const countVoucherActive = await Voucher.countDocuments({ isActive: true });
      const countVoucherInActive = await Voucher.countDocuments({ isActive: false });
      const countVoucherExpiration = await Voucher.countDocuments({
        isActive: true,
        endDate: { $gte: new Date() }, // Chỉ lấy các voucher chưa hết hạn
      });
      const countVoucherNotExpiration = await Voucher.countDocuments({
        isActive: true,
        endDate: { $lt: new Date() }, // Chỉ lấy các voucher đã hết hạn
      });
      return res.status(200).json({
        countVouchers,
        countVoucherActive,
        countVoucherInActive,
        countVoucherExpiration,
        countVoucherNotExpiration,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* đếm số lượng voucher đã sử dụng */
  /* đếm số lượng voucher chưa sử dụng */
  /* đếm số lượng voucher đã hết hạn */
  /* đếm số lượng voucher còn hạn sử dụng */
  /* đếm số lượng voucher đã hết hạn trong ngày */
  /* đếm số lượng voucher đã hết hạn trong tuần */
  /* đếm số lượng voucher đã hết hạn trong tháng */
  /* số lượng order 1 ngày */
  countOrder: async (req, res) => {
    try {
      const countOrders = await Order.countDocuments(); /* lấy hết order đang có */
      const countOrderActive = await Order.countDocuments({ isActive: true });
      const countOrderInActive = await Order.countDocuments({ isActive: false });
      const countOrderExpiration = await Order.countDocuments({
        isActive: true,
        endDate: { $gte: new Date() }, // Chỉ lấy các order chưa hết hạn
      });
      const countOrderNotExpiration = await Order.countDocuments({
        isActive: true,
        endDate: { $lt: new Date() }, // Chỉ lấy các order đã hết hạn
      });
      /* order có trạng thái là pending */
      const countOrderPending = await Order.countDocuments({ status: 'pending' });
      /* order có trạng thái là confirmed */
      const countOrderConfirmed = await Order.countDocuments({ status: 'confirmed' });
      /* order có trạng thái là delivered */
      const countOrderDelivered = await Order.countDocuments({ status: 'delivered' });
      /* order có trạng thái là done */
      const countOrderDone = await Order.countDocuments({ status: 'done' });
      /* order có trạng thái là canceled */
      const countOrderCanceled = await Order.countDocuments({ status: 'canceled' });
      /* order có trạng thái là pending và đã hết hạn */
      const countOrderPendingExpiration = await Order.countDocuments({
        status: 'pending',
        endDate: { $gte: new Date() }, // Chỉ lấy các order chưa hết hạn
      });
      return res.status(200).json({
        countOrders,
        countOrderActive,
        countOrderInActive,
        countOrderExpiration,
        countOrderNotExpiration,
        countOrderPending,
        countOrderConfirmed,
        countOrderDelivered,
        countOrderDone,
        countOrderCanceled,
        countOrderPendingExpiration,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* số lượng order 1 tuần */
  countOrderWeek: async (req, res) => {
    try {
      // const countOrderWeek = await Order.countDocuments({
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là pending */
      // const countOrderPending = await Order.countDocuments({
      //   status: 'pending',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là confirmed */
      // const countOrderConfirmed = await Order.countDocuments({
      //   status: 'confirmed',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là delivered */
      // const countOrderDelivered = await Order.countDocuments({
      //   status: 'delivered',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là done */
      // const countOrderDone = await Order.countDocuments({
      //   status: 'done',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // /* order có trạng thái là canceled */
      // const countOrderCanceled = await Order.countDocuments({
      //   status: 'canceled',
      //   createdAt: {
      //     $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      //   },
      // });
      // return res.status(200).json({
      //   countOrderWeek,
      //   countOrderPending,
      //   countOrderConfirmed,
      //   countOrderDelivered,
      //   countOrderDone,
      //   countOrderCanceled,
      // });
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const counts = await Order.aggregate([
        { $match: { createdAt: { $gte: oneWeekAgo } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]);
      const countOrderWeek = {
        total: 0,
        pending: 0,
        confirmed: 0,
        delivered: 0,
        done: 0,
        canceled: 0,
      };
      counts.forEach((item) => {
        countOrderWeek.total += item.count;
        if (item._id) {
          countOrderWeek[item._id] = item.count;
        }
      });
      return res.status(200).json(countOrderWeek);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* số lượng order 1 tháng */
  /* số lượng order 1 năm */
  /* số lượng order 1 quý */
  /* số lượng order 1 ngày theo từng sản phẩm */
  // countOrderDayByCategory: async (req, res) => {
  //   try {
  //     const oneDayAgo = new Date();
  //     oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  //     const counts = await Order.aggregate([
  //       { $match: { createdAt: { $gte: oneDayAgo } } },
  //       { $unwind: '$items' },
  //       { $group: { _id: '$items.product.category', count: { $sum: '$items.quantity' } } },
  //     ]);
  //     const countOrderDayByCategory = {};
  //     counts.forEach((item) => {
  //       countOrderDayByCategory[item._id] = item.count;
  //     });
  //     return res.status(200).json(countOrderDayByCategory);
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // },
  countOrderDayByProduct: async (req, res) => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const counts = await Order.aggregate([
        { $match: { createdAt: { $gte: oneDayAgo } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.product', count: { $sum: '$items.quantity' } } },
      ]);
      const countOrderDayByProduct = {};
      counts.forEach((item) => {
        countOrderDayByProduct[item._id] = item.count;
      });
      return res.status(200).json(countOrderDayByProduct);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* số lượng order 1 tuần theo từng sản phẩm */
  // countOrderWeekByCategory: async (req, res) => {}
  /* số lượng order 1 tháng theo từng trạng thái */
  /* thống kế về doanh thu */
  analyticPrice: async (req, res) => {
    try {
      const analyticPrices = await Order.find({ status: 'done' }).select('total');
      const analyticPrice = analyticPrices.reduce((a, b) => a + b.total, 0);
      return res.status(200).json({ analyticPrice });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* thống kê về số lượng sản phẩm đã bán */
  /* thống kê về số lượng sản phẩm đã bán theo tháng */
  /* thống kê về số lượng sản phẩm đã bán theo năm */
  /* thống kê về số lượng sản phẩm đã bán theo ngày */
  /* thống kê về số lượng sản phẩm đã bán theo tuần */
  /* thống kê về số lượng sản phẩm đã bán theo quý */
  /* số lượng người dùng */
  countUser: async (req, res) => {
    try {
      const countUsers = await User.countDocuments(); /* lấy hết user đang có */
      // const countUserActive = await User.countDocuments({ isActive: true });
      // const countUserInActive = await User.countDocuments({ isActive: false });
      return res.status(200).json({
        countUsers,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* số lượng người dùng đang hoạt động */
  // countUserIsActive: async (req, res) => {
  //   try {
  //     const countUserIsActive = await User.countDocuments({ is: true });
  //     return res.status(200).json({ countUserIsActive });
  //   } catch (error) {
  //     return res.status(500).json({ message: error.message });
  //   }
  // },
  /* số lượng người dùng đã bị khóa */
  /* số lượng người dùng đã bị ẩn */
  /* số lượng người dùng đã bị xóa */
  /* số lượng người dùng đã đăng ký */
  /* thống kê sản phẩm đang hoạt động */
  /* thống kê sản phẩm đã bị xóa */
  /* thống kê sản phẩm đã bị ẩn */
};
