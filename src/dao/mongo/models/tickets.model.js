import mongoose from "mongoose";

const collection = "tickets";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    purchase_datetime: {
      type: Date,
      unique: true,
      required: true,
      default: Date.now(),
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;
