import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;
const newsBlog = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [{ url: String, publicId: String, filename: String }],
    description: {
      type: String,
      require: true,
    },
  },
  { timestamps: true, versionKey: false }
);
newsBlog.plugin(mongoosePaginate);

const newBlogModel = mongoose.model('NewsBlog', newsBlog);
export default newBlogModel;
