import { Router } from "express";
import CartManager from '../dao/mongo/managers/cartManager.js';
import ProductManager from '../dao/mongo/managers/productManager.js';
import __dirname from "../utils.js";

const cm = new CartManager();
const pm = new ProductManager();

const router = Router();

router.get('/carts', async (req, res)=> {
    const listOfCarts = await cm.getCarts()
    res.status(200).json({message:'succes', payload: listOfCarts})
});

router.get ('/carts/:cid', async (req,res) => {
    const cartFound = await cm.gerCartById(req.params.cid) 
    res.send({status:'success', payload: cartFound})
});

router.post('/carts', async(req,res)=>{
try {
    const {obj} = req.body;
    if(!Array.isArray(obj)){
        return res.status(400).send('Invalid request: products must be an array');
    }

    const validProducts = [];

    for( const product of obj){
        const checkId = await pm.getProductsBy(product._id);
        if(checkId === null) {
            return res.status(404).send(`Product whith id${product._id} not found`);
        }
        validProducts.push(checkId);
    }
    const cart = await cm.addCart(validProducts);
    res.status(200).send(cart);

} catch (error) {
    return res.status(500).send('Internal server error');
}
});
   

router.post('/carts/:cid/producst/:pid', async(req,res)=> {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    const {quantity} = req.body;

    try{
        const checkIdProd = await pm.getProductsBy(pid);
        if (!checkIdProd) {
            return res.status(404).send({message:`Not found products whit Id: ${pid}`})
        }

        const checkIdCart = await cm.gerCartById(cid);
        if(!checkIdCart) {
            return res.status(404).send({message: `Not found cart whit id: ${cid}`});
        }

        const result = await cm.addProdInCart (cid, {
            _id: pid,
            quantity: quantity,
        });
        console.log(result);
        return res.status(200).send({message:`Product whit id:${pid} added to cart whit id: ${cid}`, cart: result})
    } catch (error){
        console.log('Error', error);
        return res.status(500).send({message:'Error occurred while processing the request'})
    }
})

//FALTA AGREGAR 2 PUT Y 2 DELETE

export default router;
