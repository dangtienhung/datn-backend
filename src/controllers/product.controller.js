import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import productValidate from '../validates/product.validate.js';

export const ProductController = {
  createProduct: async (req, res, next) => {
    try {
      const { category } = req.body;
      const { error } = productValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const existCategory = await Category.findById(category);
      if (!existCategory) {
        return res.status(404).json({ message: 'fail', err: 'Create Product failed' });
      }
      const product = await Product.create(req.body);
      if (!product) {
        return res.status(400).json({ message: 'fail', err: 'Create Product failed' });
      }
      await existCategory.updateOne({ $addToSet: { products: product._id } });
      return res.status(200).json({ message: 'succes', data: product });
    } catch (error) {
      next(error);
    }
  },

  getAllProducts: async (req, res, next) => {
    try {
      const { _page = 1, limit = 10, q } = req.query;
      const options = {
        page: _page,
        limit: limit,
        sort: { createdAt: -1 },
        populate: { path: 'category size topping', select: 'name' },
      };
      const query = q
        ? {
            $and: [
              {
                $or: [{ name: { $regex: q, $options: 'i' } }],
              },
              { is_deleted: false },
            ],
          }
        : { is_deleted: false };
      const products = await Product.paginate(query, options);
      if (!products) {
        return res.status(404).json({ message: 'fail', err: 'Not found any size' });
      }
      return res.status(200).json({ message: 'succes', data: products });
    } catch (error) {
      next(error);
    }
  },

  getProduct: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).populate(
        'category size topping',
        'name'
      );
      if (!product) {
        return res.status(404).json({ message: 'fail', err: 'Not found Product' });
      }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { category } = req.body;
      const { error } = productValidate.validate(req.body, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const existCategory = await Category.findById(category);
      if (!existCategory) {
        return res.status(404).json({ message: 'fail', err: 'Not found category' });
      }
      const product = await Product.findById(req.params.id);
      const CatRefProduct = await Category.findByIdAndUpdate(product.category, {
        $pull: { products: req.params.id },
      });
      await product.updateOne(req.body, { new: true });

      if (!CatRefProduct) {
        return res.status(404).json({ message: 'fail', err: 'Update failed' });
      }

      if (!product) {
        return res.status(404).json({ message: 'fail', err: 'Not found Product to update' });
      }
      await existCategory.updateOne({ $addToSet: { products: product._id } });
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },

  deleteRealProduct: async (req, res, next) => {
    try {
      const product = await Product.findByIdAndRemove(req.params.id);
      const updateCategory = await Category.findByIdAndUpdate(product.category, {
        $pull: { products: product._id },
      });
      if (!updateCategory) {
        return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      }
      if (!product) {
        return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },
  deleteFakeProduct: async (req, res, next) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          is_deleted: true,
        },
        { new: true }
      );
      const updateCategory = await Category.findByIdAndUpdate(product.category, {
        $pull: { products: product._id },
      });
      if (!updateCategory) {
        return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      }
      if (!product) {
        return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },
  restoreProduct: async (req, res, next) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          is_deleted: false,
        },
        { new: true }
      );
      const updateCategory = await Category.findByIdAndUpdate(product.category, {
        $addToSet: { products: product._id },
      });
      if (!updateCategory) {
        return res.status(404).json({ message: 'fail', err: 'Restore Product failed' });
      }
      if (!product) {
        return res.status(404).json({ message: 'fail', err: 'Restore Product failed' });
      }
      return res.status(200).json({ message: 'success', data: product });
    } catch (error) {
      next(error);
    }
  },
};
