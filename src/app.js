import * as dotenv from 'dotenv'

import { connectDb } from './configs/index.js'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'

dotenv.config()

/* config */
const app = express()
app.use(morgan('common'))
app.use(express.json())
app.use(cors())

/* routes */

/* connectDb */
connectDb()

/* listen */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
