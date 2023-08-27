import express from 'express';
import multer from 'multer';
import { deleteImage, updateImage, uploadImage } from '../middlewares/uploadImage.js';
import multerConfig from '../configs/multer.config.js';
import { ErrorUpload } from '../middlewares/errorUploadFile.js';
const uploadRouter = express.Router();
const uploads = multer({
  storage: multerConfig.storage,
  fileFilter: multerConfig.fileFilter,
});

uploadRouter.post('/uploadImages', uploads.array('images'), uploadImage, ErrorUpload);
uploadRouter.delete('/deleteImages/:publicId', deleteImage);
uploadRouter.put('/updateImages/:publicId', uploads.array('images'), updateImage, ErrorUpload);

export default uploadRouter;
