import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const voucherSchema = new mongoose.Schema(
  {
    nameVoucher: {
      type: String,
      required: true,
    },
    sale: {
      type: Number,
      require: true,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);
voucherSchema.plugin(mongoosePaginate);

const Voucher = mongoose.model('Voucher', voucherSchema);

export default voucherSchema;
