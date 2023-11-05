export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getCartBy = (cid, options) => {
        return this.dao.getCartBy(cid, (options = {}));
      };
    
      createCart = (user) => {
        return this.dao.createCart(user);
      };
    
      updateCart = (cid, cart) => {
        return this.dao.updateCart(cid,cart)
      };
      
      updateInCartProductQuantity = (cid,pid,quantity)=>{
        return this.dao.updateInCartProductQuantity(cid,pid,quantity)
      }
      
      deleteProdFromCart= (cid,pid) =>{
        return this.dao.deleteProdFromCart(cid,pid)

      }
      deleteCart = (cid) => {
        return this.dao.deleteCart(cid)
      };
    
}