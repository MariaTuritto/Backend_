import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js";
import cartManager from "../dao/mongo/managers/cartManager.js";
import __dirname from "../utils.js";

const cartManagerService = new cartManager();
const productManagerService = new productManager();
const router = Router();

router.get('/products', async (req, res) =>{
    const PagNumber = req.query.page;
    const products = await productManagerService.getProducts(5, PagNumber)
    console.log(products)
    res.render ('home', {products})
});
//Agregar 2 Nuevos ENDPOINTS de CARTS
router.get('/', async(req, res)=>{
    const listProducts = await cartManagerService.getCarts();
    res.render('home', {listProducts})
})

router.get('/carts/:cid', async (req, res) => {
    const cartsId = req.params.cid
    const listProducts= await cartManagerService.getCartById(cartsId);
    res.render('carts', {listProducts})

})


router.get('/realtimeproducts', async (req, res) => {
    
    res.render('realtimeproducts');
});

router.get('/chat', async (req, res) =>{
    res.render('chat')
})



export default router