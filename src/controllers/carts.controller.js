import {
  cartService,
  productsService,
  ticketsService,
} from "../service/index.js";

import ErrorsDictionary from "../dictionary/errors.js";
import errorCodes from "../dictionary/errorCodes.js";


const getCartBy = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartBy({ _id: cid }, { populate: true });
    if (!cart)  {
      req.logger.warning(
        `[${new Date().toISOString()}] Alert: Cart doesn't exist`
      );
        return res.status(404).send({ status: "error", message: "cart not found" });
    } else {
      req.logger.info(
        `[${new Date().toISOString()}] Cart successfully obtained`
      );
      req.logger.debug(`[${new Date().toISOString()}] Carrito: ${cart._id}`);
      res.send({ status: "success", payload: cart });
    }
    
  } catch (error) {
    const knownError = ErrorsDictionary[error.name];
    const customError = new Error();

    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes
      [knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);
  
    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }
};

const createCart = async (req, res, next) => {
  try {
    const cart = await cartService.createCart(cart);
    req.logger.info(
      `[${new Date().toISOString()}] Cart whit id ${cart._id} successfully created`);
   return res.send({ status: "success", payload: cart._id });
  } catch (error) {
    const knownError = ErrorsDictionary[error.name];
    const customError = new Error();

    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes[knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);
    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }

};

const deleteProductInCart = async (req, res, next) => {
  try {
    const {cid} = req.params
    const cartId = await cartService.getCartBy({_id:cid});

    let objCart = await cartId[0];
    if (objCart) {
      const productId = await objCart.products.find(
        (product) => product.product._id == pid
      );
      if (productId) {
        let arrayProducts = await objCart.products;
        let newArrayProducts = await arrayProducts.filter(
          (product) => product.product._id != pid
        );
  
        if (newArrayProducts) {
          await cartService.updateCart(
            { _id: cid },
            { products: newArrayProducts }
          );
          return "Deleted successfully";
        }
      } else {
        req.logger.warning(
          `[${new Date().toISOString()}] Alert: Product doesn't exist`
        );
        return `Product not found`;
      }
    } else {
      req.logger.warning(
        `[${new Date().toISOString()}] Alert: Cart doesn't exist`
      );
      return "Cart Not Found";
    }
  } catch (error) {
    const knownError = ErrorsDictionary[error.name];
    const customError = new Error();
    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes[knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);
    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }
};

const addProdToCart = async (req, res, next) => {
  try {
    const { cid, pid, quantity } = req.params;
    const product = await productsService.getProductsBy({_id:req.params.pid})
    let cart;
    if (cid) {
      cart = await cartService.getCartBy({ _id: cid }, { populate: false });
    } else {
      cart = await cartService.getCartById({ _id: req.user.cart });
    }
  
    const quantityAdd = quantity ? quantity : 1;
  
    if (cart) {
      if (product) {
        let arrayProducts = await cart.products;
        let positionProduct = arrayProducts.findIndex(
          (product) => product.product._id == pid
        );
  
        if (positionProduct != -1) {
          arrayProducts[await positionProduct].quantity =
            arrayProducts[positionProduct].quantity + quantityAdd;
        } else {
          arrayProducts.push({ product: pid, quantity: quantityAdd });
        }
        await cartService.updateCart(
          { _id: cart._id },
          { products: arrayProducts }
        );
        return res.send({ status: "success", message: "Added successfully" });
      } else {
        req.logger.warning(
          `[${new Date().toISOString()}] Alert: Product doesn't  exist`
        );
        return res.send({ status: "error", message: "Product not found" });
      }
    } else {
      req.logger.warning(
        `[${new Date().toISOString()}] Alert: Cart doesn't exist`
      );
      return res.send({ status: "error", message: "Cart not found" });
    }
  } catch (error) {
    const knownError = ErrorsDictionary[error.name];
    const customError = new Error();
    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes[knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);
    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { cid, pid, quantity } = req.params;

    const cartId = await cartService.getCartBy(cid);
    const quantityAdd = quantity ? quantity : 1;
  
    let objCart = await cartId[0];
    if (objCart) {
      const productId = await objCart.products.find(
        (product) => product.product._id == pid
      );
      if (productId) {
        let arrayProducts = await objCart.products;
        let positionProduct = await arrayProducts.findIndex(
          (product) => product.product._id == pid
        );
  
        arrayProducts[await positionProduct].quantity = quantityAdd;
        await cartService.updateCart({ _id: cid }, { products: arrayProducts });
          return res.send({
          status: "success",
          message: "Product updated successfully",
        });
      } else {
        req.logger.warning(`[${new Date().toISOString()}] Alert: Product doesn't exist`);
        return res.send({ status: "error", message: "Product not found" });
      }
    } else {
      return res.send({ status: "error", message: "Cart not found" });
    }
  } catch (error) {
    const knownError = ErrorsDictionary[error.name];
    const customError = new Error();
    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes[knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);
    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }
};

const deleteAllProduct = async (req, res, next) => {
  try {
    const { cid } = req.params;
   //ingreso a la lista de carts para ver si existe el id 
    const cart = await cartService.getCartBy({ _id: cid });
    if (cart) {
      await cartService.updateCart({ _id: cid }, { products: [] });
  
      return res.send({
        status: "success",
        message: "All products deleted successfully",
      });
    } else {
      req.logger.warning(`[${new Date().toISOString()}] Alert: Cart doesn't exist`);
      return res.send({ status: "error", message: "Cart not found" });
    }
  } catch (error) {
    const knownError = ErrorsDictionary[error.name];
    const customError = new Error();

    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes[knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);
    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }

};


const purchaseCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const user = req.user
    
    let purchasedProd = [];
    let purchasedNotProd = [];
  
    try {
      const cart = await cartService.getCartBy({ _id: cid }, { populate: true });
      if (!cart) {
        req.logger.warning(
          `[${new Date().toISOString()}] Alert: Cart doesn't exist`
        );
          return res.status(404).send({ status: "error", message: "Cart not found" });
      }
   
      for (const item of cart.products) {
        const pid = cart.product._id;
        const product = await productsService.getProductsBy(pid);
    
        if (!product) {
          purchasedNotProd.push(item);
          continue;
        }
        if (item.quantity >= product.stock){
          purchasedNotProd.push(item);
          continue;
        }
  
        product.stock -= item.quantity;
        await productsService.updateProduct(
          { _id: product._id },
          { stock: product.stock }
        );
          purchasedProd.push(item);
      }
    } catch (error) {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      
      return res.status(500).send({
        status: "error",
        message: "An error occurred while processing the purchase",
      });
    
    }
  
      let sum = purchasedProd.reduce((acc, item) =>
        acc += item.product.price * item.quantity, 0);
    
      let codeTicket = Date.now().toString(15) + Math.floor(Math.random() * 10000 + 1);
    
      let amount = sum.toFixed(2);
  
      let newTicket = {
        code: codeTicket,
        amount: amount,
        purchase_datetime: new Date().toISOString(),
        purchaser: user.email,
        products: purchasedProd,
      };
  
      try {
        await ticketsService.createTicket(newTicket);
        if(purchasedNotProd.length > 0){
          await cartService.updateCart(
            {_id: cid},
            {products: purchasedNotProd}
          );
        }
      } catch (error) {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        return res.status(500).send({
          status: "error",
          message: "An error occurred while processing the purchase",
        });
      } 
      req.logger.info(`[${new Date().toISOString()}] Ticket created successfully`);
      return res.send({ status: "success", message: "Cart purchased successfully", payload: newTicket});
  } catch (error) {
    const knownError = ErrorsDictionary[error.name];
    const customError = new Error();
    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes[knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);
    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }
 
};
 
const updateCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartBy({ _id: cid });
  
    if (!cart) {
      req.logger.warning(
        `[${new Date().toISOString()}] Alert: Cart doesn't exist`
      );
      return res.status(404).send({ status: "error", message: "Cart not found" });
    }
  
    await cartService.updateCart({ _id: cid }, { products: [] });
  
    res.send({
      status: "success",
      message: "Cart updated successfully",
    });
  } catch (error) {
    const knownError = ErrorsDictionary[error.name];
    const customError = new Error();
    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes[knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);

    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }
}
  const deleteCart = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.deleteCart({ _id: cid });
      if (!cart) {
        await cartService.deleteCart(cid);
        req.logger.warning(
          `[${new Date().toISOString()}] Alert: Cart doesn't exist`
        );
        return res.status(400).send({ status: "error", message: "cart not found" });
      }
      return res.send({ status: "success", message: "cart deleted successfully" });

    } catch (error) {
      const knownError = ErrorsDictionary[error.name];
      const customError = new Error();
      if (knownError) {
        customError.name = knownError;
        customError.message = error.message;
        customError.code = errorCodes[knownError];
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        next(customError);
      } else {
        req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
        next(error);
      }
    } 
  };
  


export default {
  getCartBy,
  createCart,
  deleteProductInCart,
  addProdToCart,
  updateProduct,
  deleteAllProduct,
  purchaseCart,
  updateCart,
  deleteCart,
};


















