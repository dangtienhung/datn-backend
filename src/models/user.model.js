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
      // required: true,
      // unique: true,
    },
    avatar: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    account: {
      type: String,
    },
    // email: {
    //   type: String,
    //   // required: true,
    // },
    password: {
      type: String,
      // required: true,
    },
    address: {
      type: String,
    },
    // phone: {
    //   type: String,
    // },
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
    birthday: { type: Date },
    grade: { type: Number },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

export default User;
