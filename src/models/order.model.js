import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const orderSchema = new mongoose.Schema(
  {
    user: {
      // user này là id của user
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          // product này là id của product
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        image: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        toppings: [
          {
            name: { type: String, required: true },
            price: { type: Number, required: true },
          },
        ],
        size: {
          name: { type: String, required: true },
          price: { type: Number, required: true },
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'delivered', 'done', 'canceled'],
      default: 'pending',
    },
    reasonCancelOrder: { type: String },
    noteOrder: { type: String },
    total: { type: Number },
    priceShipping: { type: Number, default: 0 },
    paymentMethodId: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Payment',
      type: String,
      required: true,
      enum: ['cod', 'momo', 'zalopay'],
      default: 'cod',
    },
    inforOrderShipping: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      noteShipping: { type: String },
    },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model('Order', orderSchema);

export default Order;
