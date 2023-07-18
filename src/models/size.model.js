import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
  },
});

sizeSchema.plugin(mongoosePaginate);

const Size = mongoose.model('Size', sizeSchema);

export default Size;
