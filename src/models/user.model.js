import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    twitterId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // slug: {
    //   // type: String,
    //   // unique: true,
    // },
    email: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    order: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      // type: String,
      // enum: ['admin', 'staff', 'customer', 'shipper'],
      // default: 'customer',
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

export default User;
