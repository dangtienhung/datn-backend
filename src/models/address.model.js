import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  default: {
    type: Boolean,
    default: false,
  },
});

addressSchema.plugin(mongoosePaginate);

const Address = mongoose.model('Address', addressSchema);

export default Address;
