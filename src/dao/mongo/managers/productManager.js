import productModel from "../models/product.model.js";

export default class productsManager {
    getProducts = () => {
            return productModel.find().lean();
    };

    getProductsBy =  (id) => {
            return productModel.findOne(id).lean();
       
    };

    addProducts = (products) => {
            return  productModel.create(products);
        
    };
 
    updateProduct =  (id, products) => {
            return productModel.updateOne({_id:id},{$set:products})
        
    };

    deleteProduct =  (id) => {
            return productModel.deleteOne({_id:id})

    };
};