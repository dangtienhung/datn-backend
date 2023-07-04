import * as dotenv from 'dotenv';

import { connectDb } from './configs/index.js';

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import rootRoutes from './routes/index.js';
import middleSwaggers from './docs/index.js';
import { errHandler, notFound } from './middlewares/errhandle.js';

dotenv.config();

/* config */
const app = express();
app.use(morgan('common'));
app.use(express.json());
app.use(cors());

/* routes */
app.use('/api-docs', middleSwaggers);
app.use('/api', rootRoutes);

app.use(notFound);

app.use(errHandler);
/* connectDb */
connectDb();

/* listen */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
