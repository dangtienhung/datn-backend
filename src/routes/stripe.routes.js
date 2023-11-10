import express from 'express';
import CheckoutStripe from '../controllers/stripe.controller.js';
const stripeRoutes = express.Router();

stripeRoutes.post('/create-checkout-session', CheckoutStripe.payment);
stripeRoutes.get('/inforBilling', CheckoutStripe.Billing);

export default stripeRoutes;
