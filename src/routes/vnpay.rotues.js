import express from 'express';
import checkoutVnpay from '../controllers/vnpay.contrller.js';
const vnpayRoutes = express.Router();

vnpayRoutes.post('/create-checkout-vnpay', checkoutVnpay.payment);
vnpayRoutes.post('/billing-vnpay', checkoutVnpay.Billing);

export default vnpayRoutes;
