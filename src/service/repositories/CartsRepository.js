export default class CartsService {
    constructor(manager) {
        this.manager = manager 
    }

    getCartBy = () => {
        return this.manager.getCartBy(cid, (options = {}));
      };
    
      createCart = () => {
        return this.manager.createCart();
      };
    
      updateCart = () => {
        return this.manager.updateCart(cid,cart)
      };
    
    
      deleteCart = () => {
        return this.manager.deleteCart(cid)
      };
    
}