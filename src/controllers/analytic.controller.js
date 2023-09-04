import Voucher from '../models/voucher.model.js';

export const analyticController = {
  /* đếm số lượng voucher hiện có */
  countVoucher: async (req, res) => {
    try {
      const countVouchers = await Voucher.countDocuments(); /* lấy hết voucher đang có */
      const countVoucherActive = await Voucher.countDocuments({ isActive: true });
      const countVoucherInActive = await Voucher.countDocuments({ isActive: false });
      console.log('🚀 ~ file: analytic.controller.js:8 ~ countVoucher: ~ count:', {
        countVouchers,
        countVoucherActive,
        countVoucherInActive,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  /* đếm số lượng voucher đã hết hạn */
  /* đếm số lượng voucher còn hạn sử dụng */
  countVoucherExpiration: async (req, res) => {
    try {
      const currentDate = new Date();
      const result = await Voucher.find({
        isActive: true,
        endDate: { $gte: currentDate }, // Chỉ lấy các voucher chưa hết hạn
      });
      console.log(
        '🚀 ~ file: analytic.controller.js:28 ~ countVoucherExpiration: ~ result:',
        result
      );
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
  /* số lượng order 1 tuần */
  /* số lượng order 1 tháng */
  /* số lượng order 1 năm */
  /* số lượng order 1 quý */
  /* số lượng order 1 ngày theo từng sản phẩm */
  /* số lượng order 1 tuần theo từng sản phẩm */
  /* số lượng order 1 tháng theo từng trạng thái */
  /* thống kế về doanh thu */
  /* thống kê về số lượng sản phẩm đã bán */
  /* thống kê về số lượng sản phẩm đã bán theo tháng */
  /* thống kê về số lượng sản phẩm đã bán theo năm */
  /* thống kê về số lượng sản phẩm đã bán theo ngày */
  /* thống kê về số lượng sản phẩm đã bán theo tuần */
  /* thống kê về số lượng sản phẩm đã bán theo quý */
  /* số lượng người dùng đang hoạt động */
  /* số lượng người dùng đã đăng ký */
  /* thống kê sản phẩm đang hoạt động */
  /* thống kê sản phẩm đã bị xóa */
  /* thống kê sản phẩm đã bị ẩn */
};
