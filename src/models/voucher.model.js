import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const voucherSchema = new mongoose.Schema({
  nameVoucher: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
  },
});
