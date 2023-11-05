import cartsModel from "../models/cart.model.js";

export default class cartsDao {
  
  getCartBy = (cid, options = {}) => {
    if(options.populate){
      return cartsModel.findOne(cid).populate("products.product");
    }
    return cartsModel.findOne({_id: cid}).lean();
  };

  createCart = () => {
    return cartsModel.create({ products: [] });
  };

  updateCart = (cid, cart) => {
    return cartsModel.updateOne({ _id: cid }, { $set:cart });
  };

  updateInCartProductQuantity = (cid, pid, quantity) => {
    return cartsModel.updateOne({_id:cid}, {$inc: {'products.[product].quantity': Number(quantity)}}, {arrayFilters:[{'element._id':pid}]})
  }
  deleteProdFromCart = (cid,pid) => {
    return cartsModel.updateOne({_id: cid}, {$pull: {products: {_id: pid}}})
  }

  deleteCart = (cid) => {
    return cartsModel.deleteOne({ _id: cid });
  };


}
