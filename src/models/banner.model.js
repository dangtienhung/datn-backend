import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
