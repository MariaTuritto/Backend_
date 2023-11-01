export default class ProductsService {
    constructor(manager){
        this.manager = manager;
    }

    getProducts = () => {
        return this.manager.getProducts(params);
      };
    
      getPaginateProducts = () => {
        return this.manager.getPaginateProducts(params, paginateOptions);
      };
    
      getProductsBy = () => {
        return this.manager.getProductsBy(pid);
      };
    
      addProducts = () => {
        return this.manager.addProducts(product);
      };
    
      updateProduct = () => {
        return this.manager.updateProduct(pid, product);
      };
    
      deleteProduct = () => {
        return this.manager.deleteProduct(pid);
      };
}