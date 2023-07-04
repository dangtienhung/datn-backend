import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['admin', 'employee', 'customer', 'shipper'],
    default: 'customer',
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

mongoose.plugin(mongoosePaginate);

const Role = mongoose.model('Role', roleSchema);

export default Role;
