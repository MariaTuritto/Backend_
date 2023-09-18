import productModel from "../models/product.model.js";

export default class productsManager {

    categories = async () => {
        try {
                const categories = await productModel.aggregate([
                        {$group:{_id:0, categories:{$addToSet:"$category"}}}
                ])
                return categories[0].categories
                
        } catch(error) {
                return console.error(error);
        }
               
                
    };


    getProducts = (filter, options) => {
            return productModel.paginate(filter, options);
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