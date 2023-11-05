import BaseRouter from "./BaseRouter.js";
import cartsController from "../controllers/carts.controller.js";
 
class cartsRouter extends BaseRouter {
  init(){

    this.get('/:cid', ['AUTH'], cartsController.getCartBy);

    this.post('/', ['ADMIN'], cartsController.createCart);

    this.put('/:cid/products/:pid', ['NO_AUTH'], cartsController.updateCart);

    this.put('/:cid/product/:pid', ['NO_AUTH'], cartsController.updateInCartProductQuantity);

    this.put('/products/:pid',['AUTH'], cartsController.addProdToCart);

    this.post('/:cid/purchase', ['NO_AUTH'], cartsController.purchaseCart);

    this.delete('/:cid', ['ADMIN'], cartsController.deleteCart);

    this.delete('/:cid/products/:pid', ['USER'], cartsController.deleteProdFromCart);

  }

}

const cartRouter = new cartsRouter();

export default cartRouter.getRouter();


































































// //Obtener cart por Id
// router.get("/:cid", async (req, res) => {
 
//     const {cid} = req.params;
//     const cart = await cartsManagerService.getCartBy({_id:cid});
//     if(!cart) return res.status(404).send({status: "error", error: "cart not found"});
//     res.send({status: "success", payload: cart });
//     console.log(cart)
  
// });
// //Crear carrito vacio
// router.post("/", async (req, res) => {
//   const cart = await cartsManagerService.createCart();
//   res.send({status: "success", payload: cart._id});

// });

// //PUT QUE SE ENCARGA DE INSERTAR EL ID DEL PRODUCTO QUE AGREGAS AL CART
// router.put("/:cid/product/:pid", async (req, res) => {
//   try {
//     const {cid,pid} = req.params
//     const cart = await cartsManagerService.getCartBy({_id:cid})
//     if(!cart) return res.status(400).send({status: "error", message: "Cart doesn't exist"})

//     const productExists = await productsManagerService.getProductsBy({_id:pid})
//     if(!productExists) return res.status(400).send({status: "error", message: "Product doesn't exist"})

//     const productExistInCart = cart.products.find(item => {
//       return item.product.toString() === pid;
//     })

//    if (!productExistInCart) {
//     cart.products.push({ product: pid, quantity: 1 })
//   } else {
//     productExistInCart.quantity++      
//   }
//    await cartsManagerService.updateCart(cid, {products: cart.products})
//   res.send({status: 'succes', message:'Product added'})

//   } catch (error) {
//     res.status(400).send({ message: "error" });
//   }
// });

// //Actualiza cart con formato de newProducts 
// router.put("/:cid", async (req,res) => {
//   try {
//     const {cid} = req.params
//     const newProducts = req.body
//     const cart = await cartsManagerService.getCartBy({_id:cid}, {populate:false})
//     if (!cart) return res.status(400).send({status: "error", message: "Cart not found"})

//     await cartsManagerService.updateCart(cid,newProducts);
//     res.send({status: "success", payload: "Cart updated" });
  
//   } catch (error) {
//     res.status(400).send({ message: error.message });
//   }
// })
//Actualizar sólo la cantidad de productos enviados por req.body (NewQuantity)
// router.put("/:cid/products/:pid", async (req,res) => {
//    try {
//     const {cid,pid} = req.params
//     const newQuantity = req.body

//     const cart = await cartsManagerService.getCartBy({_id:cid}, {populate:false})
//     if (!cart) return res.status(400).send({status: "error", message: "Cart not found"})

//     const productExists = await productsManagerService.getProductsBy(pid)
//     if(!productExists) return res.status(400).send({status: "error", message:` Product doesn't exist`})

//     const productExistInCart = cart.products.find(item => {
//       return item.product.toString() === pid;
//     })
//    if(productExistInCart) return res.status(400).send({status:'error', error: 'Products is already in cart'});
//    cart.products.push({
//     product: pid,
//    })

//     await cartsManagerService.updateCarttUnits(cid,pid,newQuantity)
//     res.send({status: "success", payload: "Quantity updated" });

//    } catch (error) {
//     res.status(400).send({ message: "An error ocurred" });

//    }
// })
// //Vaciar el carrito
// router.delete("/:cid", async (req,res) => {
//   const cartExists = await cartsManagerService.getCartBy({_id:cid}, {populate:false})
//   if(!cartExists) return res.status(400).send({status: "error", message: `Cart doesn't exist`})
//   else {
//     const result = await cartsManagerService.deleteAllProducts(req.params.cid)
//     res.send({status: "success", message: "All products have been deleted"})
//   }
// })
// // Eliminar productos por Id
// router.delete("/:cid/products/:pid", async (req,res) => {
//   try {
//     const {cid,pid} = req.params

//     const cart = await cartsManagerService.getCartBy({_id:cid}, {populate: false})
//     if(!cart) return res.status(400).send({status: "error", message: "Cart not found"})
  
//     const productExists = await productsManagerService.getProductsBy(pid)
//     if(!productExists) return res.status(400).send({status: "error", message: "Product doesn't exist"})
  
//     const productIsInCart = cart.products.find(({product}) => product.equals(pid))
//     console.log("productIsInCart", productIsInCart);

//     if(!productIsInCart) return res.status(400).send({status: "error", message: `Product with Id:${pid} not found `})
  
//     await cartsManagerService.deleteProductsById(cid,pid)
//     res.send({status: "success", message: "Product deleted"})
  
//   } catch (error) {
//     res.status(400).send({status: "error", message:"An error ocurred"})
//   }
// })

