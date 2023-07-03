import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  size: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Size',
    },
  ],
  topping: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topping',
    },
  ],
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
