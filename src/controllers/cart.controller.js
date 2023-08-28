import Cart from "../models/carrt.model.js";
import { cartValidate } from "../validates/cart.js";


export const cartController = {
  /* create Cart */
  createCart: async (req, res) => {
    const { _id } = req.user;
    try {
      const { error } = cartValidate.validate(req.body, { abortEarly: false });
      if(error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }

      let newCart = await new Cart({
        user: _id,
        name: req.body.name,
        items: req.body.items
      }).save();
      res.json({
        message: 'Cart created successfully',
        data: newCart,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  /* get all Cart */
  getAllCart: async (req, res) => {
    const { _id } = req.user;
    try {
      const cartAll = await Cart.find({ user: _id })
        .populate([
          // {
          //   path: 'items.product',
          //   select: '-is_deleted -is_active -createdAt -updatedAt',
          //   // select: '_id',
          // },
          {
            path: 'items.toppings',
            // select: '-isActive -isDeleted -updatedAt -products'
            select: 'name price _id'
          },
          {
            path: 'items.size',
            // select: '-is_deleted -is_active -createdAt'
            select: 'name price _id'
          }
        ])
        .select('-user')
        .exec();
      // console.log("cartAll::", cartAll)
      return res.json({
        message: 'Cart all successfully',
        data: cartAll,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  /* get one Cart */
  getOneCart: async (req, res) => {
    try {
      const { _id } = req.user;

      const cart = await Cart.findOne({
        user: _id,
        _id: req.params.id,
      })
        .populate('products.productId')
        .populate('products.toppingOrder')
        .exec();
      res.json({
        message: 'Cart successfully',
        data: cart,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  /* update Cart */
  updateCart: async (req, res) => {
    try {
      const { _id } = req.user;
      const {
        quantity: newQuantity,
        orderToppingId: neworderToppingId,
        totalPrice: newTotal,
      } = req.body;
      // const isOrderExit = await Topping.find({ _id: orderToppingId })
      // if (!isOrderExit) return res.status(400).json({ message: "không tìm thấy" })
      const cartItem = await Cart.findOne({
        user: _id,
        _id: req.params.id,
      });
      // console.log(cartItem)
      cartItem.products[0].quantity = newQuantity ? newQuantity : cartItem.products[0].quantity;
      cartItem.products[0].toppingOrder = neworderToppingId
        ? neworderToppingId
        : cartItem.products[0].toppingOrder;
      cartItem.totalPrice = newTotal ? newTotal : cartItem.totalPrice;

      cartItem.save();
      return res.json({
        message: 'Cart added successfully',
        productsCart: cartItem,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  /* delete Cart */
  deleteCart: async (req, res) => {
    try {
      const { _id } = req.user;
      const { cartItemId } = req.params;
      const deleteProducts = await Cart.deleteOne({
        user: _id,
        _id: cartItemId,
      });
      console.log(deleteProducts, _id, cartItemId);
      return res.json({
        message: 'delete success',
        data: deleteProducts,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
