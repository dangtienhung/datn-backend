import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import Size from '../models/size.model.js';
import Topping from '../models/topping.model.js';
import productValidate from '../validates/product.validate.js';

export const ProductController = {
  createProduct: async (req, res, next) => {
    try {
      const Data = req.body;
      // console.log(Data);
      const { category } = Data;
      const { error } = productValidate.validate(Data, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const existCategory = await Category.findById(category);
      // // console.log(existCategory);
      if (!existCategory) {
        return res.status(404).json({ message: 'fail', err: 'Create Product failed' });
      }
      const product = await Product.create(Data);
      if (!product) {
        return res.status(400).json({ message: 'fail', err: 'Create Product failed' });
      }
      // /* tạo ra bảng size & giá luôn */
      // const { sizes } = Data;
      // // if (sizes.length > 0) {
      // //   for (let size of sizes) {
      // //     const sizeItem = {
      // //       name: size.name,
      // //       price: size.price,
      // //       productId: product._id,
      // //     };
      // //     await Size.create(sizeItem);
      // //   }
      // // }
      await existCategory.updateOne({ $addToSet: { products: product._id } });
      /* tạo ra bảng size & giá luôn */
      const { sizes } = Data;
      if (sizes.length > 0) {
        for (let size of sizes) {
          const sizeItem = {
            name: size.name,
            price: size.price,
            productId: product._id,
          };
          await Size.create(sizeItem);
        }
      }
      // await Size.updateMany(
      //   { _id: { $in: sizes } },
      //   { $push: { productId: product._id } },
      //   { multi: true }
      // );
      /* update category */
      /* update id product topping array */
      const { toppings } = Data;
      if (toppings.length > 0) {
        for (let i = 0; i < toppings.length; i++) {
          await Topping.findByIdAndUpdate(toppings[i], {
            $addToSet: { products: product._id },
          });
        }
      }
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
        populate: [
          { path: 'category', select: 'name' },
          { path: 'sizes' },
          { path: 'toppings', select: '-products -isDeleted -isActive' },
        ],
      };
      const query = q
        ? {
            $and: [
              {
                $or: [{ name: { $regex: q, $options: 'i' } }],
              },
              { is_deleted: false },
              { is_active: true },
            ],
          }
        : { $and: [{ is_deleted: false }, { is_active: true }] };
      const products = await Product.paginate(query, options);
      if (!products) {
        return res.status(404).json({ message: 'fail', err: 'Not found any size' });
      }
      return res.status(200).json({ ...products });
    } catch (error) {
      next(error);
    }
  },

  getProduct: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id).populate([
        { path: 'category', select: 'name' },
        { path: 'sizes' },
        { path: 'toppings', select: '-products' },
      ]);
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
      console.log(req.body);
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

      /* cập nhật lại topping */
      const toppings = product.toppings;
      if (toppings.length > 0) {
        for (let i = 0; i < toppings.length, i++; ) {
          await Topping.findByIdAndUpdate(toppings[i], {
            $pull: { products: product._id },
          });
        }
      }
      const updateTopping = req.body.toppings;
      if (updateTopping.length > 0) {
        for (let i = 0; i < updateTopping.length, i++; ) {
          await Topping.findByIdAndUpdate(updateTopping[i], {
            $addToSet: { products: product._id },
          });
        }
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
      const product = await Product.findByIdAndDelete(req.params.id);
      /* delete product */
      const updateCategory = await Category.findByIdAndUpdate(product.category, {
        $pull: { products: product._id },
      });
      if (!updateCategory) {
        return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      }
      /* delete topping */
      const toppings = product.toppings;
      if (toppings.length > 0) {
        for (let i = 0; i < toppings.length, i++; ) {
          await Topping.findByIdAndUpdate(toppings[i], {
            $pull: { products: product._id },
          });
        }
      }
      /* xóa size */
      const sizes = product.sizes;
      if (sizes.length > 0) {
        for (let size of sizes) {
          await Size.findByIdAndDelete(size._id);
        }
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
      console.log(product);
      /* khi người dùng xóa mềm product đi rồi thì cateogry cũng sẽ tự động cho product out */
      const updateCategory = await Category.findByIdAndUpdate(product.category, {
        $pull: { products: product._id },
      });
      if (!updateCategory) {
        return res.status(404).json({ message: 'fail', err: 'Delete Product failed' });
      }

      await Size.updateMany({ _id: { $in: product.sizes } }, { $pull: { productId: product._id } });

      /* kèm topping cũng sẽ bị xóa đi */
      const toppings = product.toppings;
      if (toppings.length > 0) {
        for (let i = 0; i < toppings.length, i++; ) {
          await Topping.findByIdAndUpdate(toppings[i], {
            $pull: { products: product._id },
          });
        }
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

      await Size.updateMany(
        { _id: { $in: product.sizes } },
        { $addToSet: { productId: product._id } }
      );

      /* khi khôi phục lại sản phẩm thì cũng sẽ có các topping đi kèm import vào */
      const toppings = product.toppings;
      if (toppings.length > 0) {
        for (let i = 0; i < toppings.length, i++; ) {
          await Topping.findByIdAndUpdate(toppings[i], {
            $addToSet: { products: product._id },
          });
        }
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
