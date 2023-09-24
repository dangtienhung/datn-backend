import express from 'express';
import newBlogsController from '../controllers/newsBlogs.controller';
const routerNewBlogs = express.Router();

routerNewBlogs.post('/create-newsBlog', newBlogsController.createNewBlogs);
// routerNewBlogs.get('/newsBlog', getAllNewBlogs);
// // router.get('/order/:id', orderController.getById);
// routerNewBlogs.put('/newsBlog/:id', updateNewBlogs);
// routerNewBlogs.delete('/newsBlog-remove/:id', removeNewBlogs);

export default router;
