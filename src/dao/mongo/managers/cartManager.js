import cartModel from "../models/cart.model.js";
import productManager from "./productManager.js";

const pm = new productManager();

export default class cartManager {
  getCarts = async () => {
    try {
      const carts = await cartModel.find();
      return carts;
    } catch (error) {
      console.error("Error getting carts:", error.message);
      return [];
    }
  };

  getCartById = async (cartId) => {
    try {
      const cart = await cartModel.findById(cartId);
      return cart;
    } catch (error) {
      console.error("Error getting carts by ID:", error.message);
      return error;
    }
  };

  addCart = async (products) => {
    try {
      let cartData = {};
      if (products && products.length > 0) {
        cartData.products = products;
      }

      const cart = await cartModel.create(cartData);
      return cart;
    } catch (error) {
      console.error("Error creating cart:", error.message);
      return error;
    }
  };

  addProdInCart = async (cid, obj) => {
    try {
      const filter = { _id: cid, "products._id": obj._id };
      const cart = await cartModel.findById(cid);
      const findProduct = cart.products.some(
        (product) => product._id.toString() === obj._id
      );

      if (findProduct) {
        const update = { $inc: { "products.$.quantity": obj.quantity } };
        await cartModel.updateOne(filter, update);
      } else {
        const update = {
          $push: { products: { _id: obj._id, quantity: obj.quantity } },
        };
        await cartModel.updateOne({ _id: cid }, update);
      }

      return await cartModel.findById(cid);
    } catch (error) {
      console.error("Error adding product to cart:", error.message);
      return error;
    }
  };
  updateCart = (id, cart) => {
    return cartModel.updateOne({ _id: id }, { $set: cart });
  };
  deleteCart = (id) => {
    return cartModel.deleteOne({ _id: id });
  };
}