import cartsModel from "../models/cart.model.js";

export default class CartsManager {
  
  getCartBy = (cid, options = {}) => {
    if(options.populate){
      return cartsModel.findOne(cid).populate("products.product");
    }
    return cartsModel.findOne({_id: cid})
  };

  createCart = () => {
    return cartsModel.create({ products: [] });
  };

  updateCart = (cid, newCart) => {
    return cartsModel.updateOne({ _id: cid }, { $set:newCart });
  };

  updateCarttUnits = (cid, pid, newQuantity) => {
    return cartsModel.updateOne(
      { _id: cid },
      { $inc: { "products.[product].quantity": Number(newQuantity) } },
      { arrayFilters: [{ "element._id": pid }] }
    );
  };

  deleteCart = (cid) => {
    return cartsModel.deleteOne({ _id: cid });
  };

  
  deleteAllProducts = (cid) => {
    return cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
  };
  
  deleteProductsById = (cid, pid) => {
    return cartsModel.updateOne({_id: cid}, {$pull: {products: {_id: pid}}})
  }



}
