import cartsModel from "../models/carts.model.js";

export default class CartsManager {
  getCarts = () => {
    return cartsModel.find().populate("products.product");
  };

  getCartBy = (id) => {
    return cartsModel.findOne({ _id: id }).populate("products.product");
  };

  addCart = (cart) => {
    return cartsModel.create({ products: cart });
  };

  updateCart = (cid, newCart) => {
    return cartsModel.updateOne({ _id: cid }, { $push: { products: newCart } });
  };

  updateCarttUnits = (cid, pid, newQuantity) => {
    return cartsModel.updateOne(
      { _id: cid },
      { $inc: { "products.[product].quantity": Number(newQuantity) } },
      { arrayFilters: [{ "element._id": pid }] }
    );
  };

  deleteProductFromCartById = (cid, pid) => {
    return cartsModel.updateOne(
      { _id: cid },
      { $pull: { products: { _id: pid } } }
    );
  };

  deleteAllProductsFromCartById = (cid) => {
    return cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
  };

  deleteCart = (id) => {
    return cartsModel.deleteOne({ _id: id });
  };
}
