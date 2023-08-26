import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import Size from '../models/size.model.js';
import Topping from '../models/topping.model.js';
import productValidate from '../validates/product.validate.js';

export const ProductController = {
  createProduct: async (req, res, next) => {
    try {
      const Data = req.body;
      const { category } = Data;
      const { error } = productValidate.validate(Data, { abortEarly: false });
      if (error) {
        return res
          .status(400)
          .json({ message: 'fail', err: error.details.map((err) => err.message) });
      }
      const existCategory = await Category.findById(category);
      if (!existCategory) {
        return res.status(404).json({ message: 'fail', err: 'Create Product failed' });
      }
      /* tạo ra bảng size & giá luôn */
      const sizeList = [];
      const { sizes } = Data;
      if (sizes.length > 0) {
        for (let size of sizes) {
          const sizeItem = {
            name: size.name,
            price: size.price,
          };
          const result = await Size.create(sizeItem);
          sizeList.push(result._id);
        }
      }
      /* update id product to category */
      const data = { ...Data, sizes: sizeList };
      const product = await Product.create(data);
      if (!product) {
        return res.status(400).json({ message: 'fail', err: 'Create Product failed' });
      }
      /* cập id product to category */
      await Category.findByIdAndUpdate(category, {
        $addToSet: { products: product._id },
      }).exec();
      /* update id product to size */
      if (sizeList.length > 0) {
        for (let size of sizeList) {
          await Size.findByIdAndUpdate(size, {
            $addToSet: { productId: product._id },
          });
        }
      }
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
      const { _page = 1, limit = 10, q = '', c = '' } = req.query;
      console.log(q, c);
      let query = { $and: [{ is_deleted: false }, { is_active: true }] };
      const options = {
        page: _page,
        limit: limit,
        sort: { createdAt: -1 },
        populate: [
          { path: 'category', select: 'name' },
          { path: 'sizes', select: '-productId' },
          { path: 'toppings', select: '-products -isDeleted -isActive' },
        ],
      };
      if (q && !c) {
        query = {
          $and: [
            {
              $or: [{ name: { $regex: q, $options: 'i' } }],
            },
            { is_deleted: false },
            { is_active: true },
          ],
        };
      } else if (c && !q) {
        query = {
          $and: [
            {
              $or: [{ category: { _id: c } }],
            },
            { is_deleted: false },
            { is_active: true },
          ],
        };
      } else if (q && c) {
        query = {
          $and: [
            {
              $or: [{ name: { $regex: q, $options: 'i' } }],
            },
            {
              $or: [{ category: { _id: c } }],
            },
            { is_deleted: false },
            { is_active: true },
          ],
        };
      }
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
        { path: 'sizes', select: '-productId' },
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
      const body = req.body;
      const { id } = req.params;
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
      /* dựa vào id và tìm ra produc có tồn tại hay khong */
      const productExit = await Product.findById(id);
      if (!productExit) {
        return res.status(404).json({ message: 'fail', err: 'Not found Product' });
      }
      /* delete size đó luôn */
      if (productExit.sizes.length > 0) {
        const sizeList = productExit.sizes;
        if (sizeList.length > 0) {
          for (let size of sizeList) {
            await Size.findByIdAndDelete(size);
          }
        }
      }
      /* gỡ topping trước đó mà product đã gắn */
      const toppingList = productExit.toppings;
      if (toppingList.length > 0) {
        for (let topping of toppingList) {
          await Topping.findByIdAndUpdate(topping, {
            $pull: { products: productExit._id },
          });
        }
      }
      /* gỡ category ra khỏi product */
      await Category.findByIdAndUpdate(productExit.category, {
        $pull: { products: productExit._id },
      });
      const { sizes, toppings } = body;
      /* tạo size */
      const sizeListNew = [];
      if (sizes.length > 0) {
        for (let size of sizes) {
          const sizeItem = {
            name: size.name,
            price: size.price,
          };
          const result = await Size.create(sizeItem);
          sizeListNew.push(result._id);
        }
      }
      /* update product đó */
      const data = { ...body, sizes: sizeListNew };
      console.log('🚀 ~ file: product.controller.js:200 ~ updateProduct: ~ data:', data);
      const productUpdate = await Product.findByIdAndUpdate({ _id: id }, data, { new: true });
      if (!productUpdate) {
        return res.status(404).json({ message: 'fail', err: 'Update Product failed' });
      }
      /* update id product to category */
      for (let topping of body.toppings) {
        await Topping.findByIdAndUpdate(topping, {
          $addToSet: { products: productUpdate._id },
        });
      }
      /* update category */
      await Category.findByIdAndUpdate(body.category, {
        $addToSet: { products: productUpdate._id },
      }).exec();
      return res.status(200).json({ message: 'success', data: productUpdate });
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
