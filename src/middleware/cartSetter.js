import { cartService } from "../service/index.js";

const cartSetter = async (req,res,next) => {
    if(req.cookies.cart&&req.user) {
       
        res.clearCookie("cart");
        return next();
      }
    
      if (!req.cookies.cart && !req.user) {
        const cart = await cartService.createCart();
        res.cookie("cart", cart._id.toString());
      }
      next();
    };

export default cartSetter