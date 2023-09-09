import {Router} from 'express';
import productManager from '../dao/mongo/managers/productManager.js';
import uploader from '../service/uploadService.js';
import __dirname from '../utils.js';

const productManagerService = new productManager();
const router = Router();

router.get("/", async (req, res) => {
    const products = await productManagerService.getProducts();
    console.log(products)
    res.send({status: 'success', payload: products})
   
})

router.get("/products/:pid",async(req,res)=>{
    const productFound= await productManagerService.getProductsById(req.params)
    res.send({status:"success",productFound})
})

router.post("/products",async(req,res)=>{
    const newProduct = await productManagerService.addProduct(req.body)
    res.send({status:"success",newProduct})
})

router.put("/products/:pid",async(req,res)=>{
console.log(req.params)
    const updatedProduct=await productManagerService.updateProduct(req.params,req.body)
    res.send({status:"success",updatedProduct})
})
router.delete("/products/:pid",async(req,res)=>{
    const deletedProduct=await productManagerService.deleteProduct(req.params)
    res.send({status:"success",deletedProduct})
})





export default router
