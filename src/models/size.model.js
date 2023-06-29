import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

sizeSchema.plugin(mongoosePaginate);

const Size = mongoose.model('Size', sizeSchema);

export default Size;
