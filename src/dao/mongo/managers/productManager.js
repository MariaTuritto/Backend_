import productModel from "../models/product.model.js";

export default class productsManager {

    getProductsAgg = ()=> {
        return productModel.aggregate([
                {$match: {status: true}},
                {$sort: {price:-1}}
               
        ])
    }
    getProducts = (page,limit) => {
            return productModel.paginate({},{page,limit,lean:true});
    };

    getProductsBy =  (pid) => {
            return productModel.findOne({_id:pid}).lean();
       
    };

    addProducts = (product) => {
            return  productModel.create(product);
        
    };
 
    updateProduct =  (id, product) => {
            return productModel.updateOne({_id:id},{$set:product})
        
    };

    deleteProduct =  (id) => {
            return productModel.deleteOne({_id:id})

    };
};