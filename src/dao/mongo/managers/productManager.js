import productModel from "../models/product.model.js";

export default class productsManager {
  getProducts = (params) => {
    return productModel.find(params).lean();

}
  getPaginateProducts = (params, paginateOptions) => {
    return productModel.paginate(params, paginateOptions)
  }
  
  getProductsBy = (pid) => {
    return productModel.findOne({ _id: pid }).lean();
  };

  addProducts = (product) => {
    return productModel.create(product);
  };

  updateProduct = (pid, product) => {
    return productModel.updateOne({ _id: pid }, { $set: product });
  };

  deleteProduct = (pid) => {
    return productModel.deleteOne({ _id: pid });
  };
}
