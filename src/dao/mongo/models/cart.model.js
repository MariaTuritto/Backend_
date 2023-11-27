import mongoose from "mongoose";

const collection = "Carts";

const productSubSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Products",
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    products: {
      type: [productSubSchema],
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);

const cartsModel = mongoose.model(collection, schema);

export default cartsModel;
