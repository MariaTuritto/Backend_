import { cartsService, productsService } from "../service/index.js";



const getCartBy = async(req,res) => {
    const {cid} = req.params;
    const cart = await cartsService.getCartBy({_id: cid});
    if(!cart)
        return  res.status(404).send({status:"error", message: "cart not found"});
    res.send({status: "success", payload: cart})
};

const createCart = async(req,res)=> {
    const cart = await cartsService.createCart();
    res.send({status: "success", payload: cart._id});
    };

const updateCart = async(req,res)=>{
    const {cid,pid} = req.params
    const cart = await cartsService.findOne({cid,pid})
    if(!cart) 
        return res.status(400).send({status: "error", message: "Cart doesn't exist"})

    const productExists = await productsService.getProductsBy({_id:pid})
    if(!productExists) 
        return res.status(400).send({status: "error", message: "Product doesn't exist"})

    const productExistInCart = cart.products.find(item => {
      return item.product.toString() === pid;
    })

    if (!productExistInCart) {
        cart.products.push({ product: pid, quantity: 1 })
  } else {
        productExistInCart.quantity++      
  }
    await cartsService.updateCart(cid, 
    {
        products: cart.products,
        quantity: cart.quantity
    })
        res.send({status: "success", payload: cart})
  }


const updateCartUser = async (req, res) => {
    const { pid } = req.params;
    const cart = await cartsService.getCartBy({ _id: req.user.cart });
    if (!cart) {
      return res.status(400).send({ status: "error", message: "Cart not found" });
    }
    const product = await productsService.getProductBy({ _id: pid });
    if (!product)
      return res
        .status(400)
        .send({ status: "error", message: "Product not found" });
    const productExistsInCart = cart.products.find((item) => {
      return item.product.toString() === pid;
    });
    if (productExistsInCart) {
      // Verificar si hay en stock y restar
      if (cart.product.stock > cart.quantity) {
        cart.quantity += 1;
        // Restar stock del producto
        cart.product.stock -= 1;
      } else {
        return res
          .status(400)
          .send({ status: "error", message: "Not enough stock available." });
      }
    } else {
      // Si el producto no está en el carrito, agrégalo con una cantidad de 1
      if (product.stock > 0) {
        cart.quantity += 1;
  
        cart.products.push({ product: pid, quantity: 1 });
        // Restar del stock del producto
      } else {
        return res
          .status(400)
          .send({ status: "error", message: "Product out of stock." });
      }
    }
  
    await cartsService.updateCart(req.user.cart, {
      products: cart.products,
      quantity: cart.quantity,
    });
  
    res.send({ status: "success", message: "Cart updated successfully" });
  };

const deleteCart = async(req, res) => {
    const { cid } = req.params;
    const cart = await cartsService.findOne({ _id: cid });
    if (!cart)
        return res.status(400).send({ status: "error", message: "cart not found" });
    await cartsService.deleteCart(cid);
    res.send({ status: "success", message: "cart deleted successfully" });
}

const deleteProductsById = async (req,res) => {
    const {cid, pid} = req.params;
    const productInCart = await cartsService.findOne({cid, pid});
    if(!productInCart)
        return res.status(400).send({status:"error", message:"product in cart not found"});
    await cartsService.deleteProductsById(cid,pid);
    res.send({status:"success", message: "product in cart deleted successfully"})

}


export default {
    getCartBy,
    createCart,
    updateCart,
    updateCartUser,
    deleteCart,
    deleteProductsById

}