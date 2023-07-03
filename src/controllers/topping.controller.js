import Topping from '../models/topping.model.js';
import toppingValidate from '../validates/topping.validate.js';

export const toppingController = {
  createTopping: async (req, res, next) => {
    try {
      console.log('Hello');
      const { error } = toppingValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const topping = await Topping.create(req.body);
      if (!topping) {
        return res.status(400).json({ message: 'fail', err: 'create topping failed' });
      }

      return res.status(200).json({ message: 'succes', data: topping });
    } catch (error) {
      next(error);
    }
  },

  getAllTopping: async (req, res, next) => {
    try {
      const topping = await Topping.find({});
      if (!topping) {
        return res.status(404).json({ message: 'fail', err: 'Not found any Topping' });
      }
      return res.status(200).json({ message: 'succes', data: topping });
    } catch (error) {
      next(error);
    }
  },

  getTopping: async (req, res, next) => {
    try {
      const topping = await Topping.findById(req.params.id);
      console.log(req.params.id);
      if (!topping) {
        return res.status(404).json({ message: 'fail', err: 'Not found Topping' });
      }
      return res.status(200).json({ message: 'success', data: topping });
    } catch (error) {
      next(error);
    }
  },

  updateTopping: async (req, res, next) => {
    try {
      const { error } = toppingValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const topping = await Topping.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!topping) {
        return res.status(404).json({ message: 'fail', err: 'Not found topping to update' });
      }
      return res.status(200).json({ message: 'success', data: topping });
    } catch (error) {
      next(error);
    }
  },

  deleteTopping: async (req, res, next) => {
    try {
      const topping = await Topping.findByIdAndRemove(req.params.id);
      if (!topping) {
        return res.status(404).json({ message: 'fail', err: 'Not found Size to delete' });
      }
      return res.status(200).json({ message: 'success', data: topping });
    } catch (error) {
      next(error);
    }
  },
};
