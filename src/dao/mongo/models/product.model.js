import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: Array,
      default: [],
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: Array,
      required:true,
      index: true
    },
  },
  { timestamps: true }
);

schema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, schema);

export default productModel;
