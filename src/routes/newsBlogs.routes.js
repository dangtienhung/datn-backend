import express from 'express';
import newBlogsController from '../controllers/newsBlogs.controller.js';
const routerNewBlogs = express.Router();

routerNewBlogs.post('/create-newsBlog', newBlogsController.createNewBlogs);
routerNewBlogs.get('/newsBlog', newBlogsController.getAllNewBlogs);
// router.get('/order/:id', orderController.getById);
routerNewBlogs.put('/newsBlog/:id', newBlogsController.updateNewBlogs);
routerNewBlogs.delete('/newsBlog-remove/:id', newBlogsController.removeNewBlogs);

export default routerNewBlogs;
