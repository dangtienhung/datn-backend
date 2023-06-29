import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered', 'canceled'],
      default: 'pending',
    },
    total: {
      type: Number,
      required: true,
    },
    priceShipping: {
      type: Number,
      default: 0,
      required: true,
    },
    paymentMethodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    address: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model('Order', orderSchema);

export default Order;
