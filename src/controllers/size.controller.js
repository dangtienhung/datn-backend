import Size from '../models/size.model.js';
import SizeValidate from '../validates/size.validate.js';

export const SizeController = {
  createSize: async (req, res) => {
    try {
      const { error } = SizeValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const size = await Size.create(req.body);
      if (!size) {
        return res.status(400).json({ message: 'fail', err: 'create size failed' });
      }

      return res.status(200).json({ message: 'succes', data: size });
    } catch (error) {
      return res.status(500).json({ message: 'fail', err: error });
    }
  },

  getAllSize: async (req, res) => {
    try {
      const size = await Size.find({});
      if (!size) {
        return res.status(404).json({ message: 'fail', err: 'Not found any size' });
      }
      return res.status(200).json({ message: 'succes', data: size });
    } catch (error) {
      return res.status(500).json({ message: 'fail', err: error });
    }
  },

  getSize: async (req, res) => {
    try {
      const size = await Size.findById(req.params.id);
      if (!size) {
        return res.status(404).json({ message: 'fail', err: 'Not found Size' });
      }
      return res.status(200).json({ message: 'success', data: size });
    } catch (error) {}
  },

  updateSize: async (req, res) => {
    try {
      const { error } = SizeValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const size = await Size.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!size) {
        return res.status(404).json({ message: 'fail', err: 'Not found Size to update' });
      }
      return res.status(200).json({ message: 'success', data: size });
    } catch (error) {}
  },

  deleteSize: async (req, res) => {
    try {
      const size = await Size.findByIdAndRemove(req.params.id);
      if (!size) {
        return res.status(404).json({ message: 'fail', err: 'Not found Size to delete' });
      }
      return res.status(200).json({ message: 'success', data: size });
    } catch (error) {
      return res.status(500).json({ message: 'fail', err: error });
    }
  },
};
