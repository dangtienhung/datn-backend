import * as dotenv from 'dotenv';

import mongoose from 'mongoose';

dotenv.config();

export const connectDb = () => {
  mongoose
    .connect(
      // 'mongodb+srv://hungdang02042003:jVp9aHU2eqE747nE@du-an-framework2-milk-t.ntg5d7s.mongodb.net/?retryWrites=true&w=majority'
      'mongodb://localhost:27017/be_du_an_tot_nghiep'
    )
    .then(() => console.log('Database connected!'))
    .catch((err) => console.log(err));
};
