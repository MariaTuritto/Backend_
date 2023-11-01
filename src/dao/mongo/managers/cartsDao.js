import cartsModel from "../models/cart.model.js";

export default class cartsDao {
  
  getCartBy = (cid, options = {}) => {
    if(options.populate){
      return cartsModel.findOne(cid).populate("products.product");
    }
    return cartsModel.findOne({_id: cid})
  };

  createCart = () => {
    return cartsModel.create({ products: [] });
  };

  updateCart = (cid, cart) => {
    return cartsModel.updateOne({ _id: cid }, { $set:cart });
  };


  deleteCart = (cid) => {
    return cartsModel.deleteOne({ _id: cid });
  };

 
  deleteProductsById = (cid, pid) => {
    return cartsModel.updateOne({_id: cid}, {$pull: {products: {_id: pid}}})
  }



}
