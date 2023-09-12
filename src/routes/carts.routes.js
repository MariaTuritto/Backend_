import { Router } from "express";
import cartManager from "../dao/mongo/managers/cartManager.js"
import productsManager from "../dao/mongo/managers/productManager.js";

const router = Router()
const cartsManagerService = new cartManager()
const productsManagerService = new productsManager()
//obtener todos los cart creados
router.get("/", async (req,res) => {
  try {
    const carts = await cartsManagerService.getCarts()
    res.send({status: "success", payload: carts})
  } catch (error) {
    res.status(400).send({status: "error", message: error.message})
  }
})

//Obtener un cart por su Id
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartsManagerService.getCartBy(req.params.cid);
    res.send({status: "success", payload: cart });
  } catch (error) {
    res.status(404).send({ message: "error" });
  }
});

//Crear cart sin o con products
router.post("/", async (req, res) => {
  try {
    const cartData = req.body
    const cart = await cartsManagerService.addCart(cartData)
    res.send({status: "success", payload: cart });
  } catch (error) {
    res.status(400).send({ status: "error", message: "error" });
  }
});
//
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const {cid,pid} = req.params
    
    const cart = await cartsManagerService.getCartBy(cid)
    if(!cart) return res.status(400).send({status: "error", message: "Cart doesn't exist"})

    const productExists = await productsManagerService.getProductsBy(pid)
    if(!productExists) return res.status(400).send({status: "error", message: "Product doesn't exist"})

    const productIsInCart = cart.products.find(({product}) => product.equals(pid))

    if (!productIsInCart) {
      cart.products.push({ product: pid, quantity: 1 })
    } else {
      productIsInCart.quantity++      
    }
    
    await cartsManagerService.updateCart(cid,cart.products);
    res.send({status: "success", payload: "Product added" });
  } catch (error) {
    res.status(400).send({ message: "error" });
  }
});
//Actualiza cart con formato de newProducts 
router.put("/:cid", async (req,res) => {
  try {
    const {cid} = req.params
    const newProducts = req.body
    const cart = await cartsManagerService.getCartBy(cid)
    if (!cart) return res.status(400).send({status: "error", message: "Cart not found"})
    
    await cartsManagerService.updateCart(cid,newProducts);
    res.send({status: "success", payload: "Cart updated" });
  
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
})
//Actualizar sólo la cantidad de productos enviados por req.body (NewQuantity)
router.put("/:cid/products/:pid", async (req,res) => {
   try {
    const {cid,pid} = req.params
    const newQuantity = req.body

    const cart = await cartsManagerService.getCartBy(cid)
    if (!cart) return res.status(400).send({status: "error", message: "Cart not found"})

    const productExists = await productsManagerService.getProductsBy(pid)
    if(!productExists) return res.status(400).send({status: "error", message:` Product with Id:${pid} doesn't exist`})

    const productIsInCart = cart.products.find(({product}) => product.equals(pid))
    if(!productIsInCart) return res.status(400).send({status: "error", message: `Product with Id:${pid} not found `})

    await cartsManagerService.updateCarttUnits(cid,pid,newQuantity)
    res.send({status: "success", payload: "Quantity updated" });

   } catch (error) {
    res.status(400).send({ message: "An error ocurred" });

   }
})
//Eliminar todos los products del cart 
router.delete("/:cid", async (req,res) => {
  const cartExists = await cartsManagerService.getCartBy(req.params.cid)
  if(!cartExists) return res.status(400).send({status: "error", message: `Cart doesn't exist`})
  else {
    const result = await cartsManagerService.deleteAllProductsFromCartById(req.params.cid)
    res.send({status: "success", message: "All products have been deleted"})
  }
})
//Eliminar 
router.delete("/:cid/products/:pid", async (req,res) => {
  try {
    const {cid,pid} = req.params

    const cart = await cartsManagerService.getCartBy(cid)
    if(!cart) return res.status(400).send({status: "error", message: "Cart not found"})
  
    const productExists = await productsManagerService.getProductsBy(pid)
    if(!productExists) return res.status(400).send({status: "error", message: "Product doesn't exist"})
  
    const productIsInCart = cart.products.find(({product}) => product.equals(pid))
  
    if(!productIsInCart) return res.status(400).send({status: "error", message: `Product with Id:${pid} not found `})
  
    await cartsManagerService.deleteProductFromCartById(cid,pid)
    res.send({status: "success", message: "Product deleted"})
  
  } catch (error) {
    res.status(400).send({status: "error", message:"An error ocurred"})
  }
})

export default router