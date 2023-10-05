import Address from '../models/address.model.js';
import User from '../models/user.model.js';
import { addressValidate } from '../validates/address.validate.js';

export const addressController = {
  createAddress: async (req, res) => {
    try {
      const body = req.body;
      /* validate */
      const { error } = addressValidate.validate(body);
      if (error) {
        return res.status(400).json({
          errors: error.details.map((err) => err.message),
        });
      }
      /* create */
      const address = await Address.create(body);
      if (!address) {
        return res.status(400).json({ errors: ['create address failed'] });
      }
      /* ref to addres user */
      await User.findByIdAndUpdate(body.userId, {
        $addToSet: { address: address._id },
      });
      return res.status(200).json({ address });
    } catch (error) {
      return res.status(500).json({
        errors: error.message,
      });
    }
  },

  /* update address */
  updateAddress: async (req, res) => {
    try {
      const body = req.body;
      const { id } = req.params;
      /* validate */
      const { error } = addressValidate.validate(body);
      if (error) {
        return res.status(400).json({
          errors: error.details.map((err) => err.message),
        });
      }
      /* update */
      const address = await Address.findByIdAndUpdate(id, body, {
        new: true,
      });
      if (!address) {
        return res.status(400).json({ errors: ['update address failed'] });
      }
      return res.status(200).json({ address });
    } catch (error) {
      return res.status(500).json({
        errors: error.message,
      });
    }
  },

  /* delete */
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;
      /* delete */
      const address = await Address.findByIdAndDelete(id);
      if (!address) {
        return res.status(400).json({ errors: ['delete address failed'] });
      }
      /* ref to addres user */
      await User.findByIdAndUpdate(address.userId, {}, { $pull: { address: address._id } });
      return res.status(200).json({ address });
    } catch (error) {
      return res.status(500).json({
        errors: error.message,
      });
    }
  },

  /* get all address by userid */
  getAllAddressByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const { page, limit } = req.query;
      /* validate */
      const options = {
        page: page || 1,
        limit: limit || 10,
      };
      const address = await Address.paginate({ userId }, options);
      if (!address) {
        return res.status(400).json({ errors: ['get all address failed'] });
      }
      return res.status(200).json({ ...address });
    } catch (error) {
      return res.status(500).json({
        errors: error.message,
      });
    }
  },
};
