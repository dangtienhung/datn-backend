import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['admin', 'employee', 'customer', 'shipper'],
    default: 'customer',
  },
  users: [{}],
});
