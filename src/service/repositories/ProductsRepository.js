export default class ProductRepository 
{
    constructor(dao){
        this.dao = dao;
    }

    getProducts = (params) => {
        return this.dao.getProducts(params);
      };
    
      getPaginateProducts = (params, paginateOptions) => {
        return this.dao.getPaginateProducts(params, paginateOptions);
      };
    
      getProductsBy = (pid) => {
        return this.dao.getProductsBy(pid);
      };
    
      addProducts = (product) => {
        return this.dao.addProducts(product);
      };
    
      updateProduct = (pid,product) => {
        return this.dao.updateProduct(pid, product);
      };
    
      deleteProduct = (pid) => {
        return this.dao.deleteProduct(pid);
      };
}