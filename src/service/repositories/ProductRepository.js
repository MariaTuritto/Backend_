export default class ProductRepository 
{
    constructor(dao){
        this.dao = dao;
    }

    getProducts = () => {
        return this.dao.getProducts(params);
      };
    
      getPaginateProducts = () => {
        return this.dao.getPaginateProducts(params, paginateOptions);
      };
    
      getProductsBy = () => {
        return this.dao.getProductsBy(pid);
      };
    
      addProducts = () => {
        return this.dao.addProducts(product);
      };
    
      updateProduct = () => {
        return this.dao.updateProduct(pid, product);
      };
    
      deleteProduct = () => {
        return this.dao.deleteProduct(pid);
      };
}