import * as dotenv from 'dotenv';

import mongoose from 'mongoose';

dotenv.config();

export const connectDb = () => {
  const uri = 'mongodb://127.0.0.1:27017/be_du_an_tot_nghiep';
  mongoose
    .connect(process.env.MONGOOSE_LOCAL)
    .then(() => console.log('Database connected!'))
    .catch((err) => console.log(err));
};
