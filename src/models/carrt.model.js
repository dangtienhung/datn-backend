import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          require: true,
        },
        toppingOrder: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Topping',
          },
        ],
      },
    ],

    // totalAfterDiscount: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // quantity: {
    //   type: Number,
    //   required: true
    // },
    totalPrice: {
      type: Number,
      required: true,
    },
    // toppingOrder: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Topping"
    // },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

cartSchema.plugin(mongoosePaginate);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
