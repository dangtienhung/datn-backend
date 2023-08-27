import Voucher from '../models/voucher.model.js';

export const analyticController = {
  /* đếm số lượng voucher hiện có */
  countVoucher: async (req, res) => {
    try {
      const count = await Voucher.countDocuments();
      console.log('🚀 ~ file: analytic.controller.js:8 ~ countVoucher: ~ count:', count);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
