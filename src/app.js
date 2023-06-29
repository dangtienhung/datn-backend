import * as dotenv from 'dotenv';

import { connectDb, swaggerDefinition } from './configs/index.js';

import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import rootRoutes from './routes/index.js';
import swaggerUI from 'swagger-ui-express';

dotenv.config();

/* config */
const app = express();
app.use(morgan('common'));
app.use(express.json());
app.use(cors());

/* routes */
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDefinition));
app.use('/api/', rootRoutes);

/* connectDb */
connectDb();

/* listen */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
