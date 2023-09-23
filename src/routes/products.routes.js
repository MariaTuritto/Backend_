import {Router} from 'express';
import productManager from '../dao/mongo/managers/productManager.js';
import uploader from '../service/uploadService.js';

const router = Router();
const productManagerService = new productManager();



router.get("/", async (req, res) => {

    try {
  
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const sort = req.query.sort || 'asc';
    const category = req.query.category || null; 
    const status = req.query.status || null;     

  
    const queryObj = {};

    if (category) {
        queryObj.category = category; 
    }

    if (status) {
        queryObj.status = status; 
    }

    const paginationResult = await productManagerService.getProductsP(limit, page, queryObj, sort)

    res.send({status:"succes", payload: paginationResult});

    } catch (error) {
      res.json({ error: error });
    }
  });
  
  router.post("/", uploader.array('thumbnail'), async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        code,
        status,
        stock,
        category,
      } = req.body;

      if (!title || !description || !price ||  !code || !stock || !category) {
        res.status(400).send({status: "error", message: "Incomplete values" })
      }
      const newProduct = {
        title,
        description,
        price,
        code,
        status,
        stock,
        category,
      }
      
      const thumbnail = req.files.map(file=>`${req.protocol}://${req.hostname}:${process.env.PORT||8080}/img/${file.filename}`)
      newProduct.thumbnail = thumbnail; 

      const result = await productManagerService.addProducts(newProduct)
      res.send({status: "success", payload: result._id});
    } catch (error) {
      res.status(400).json({ error: "error addProducts" });
    }
  });


  router.get("/:pid", async (req, res) => {
    try {
      const {pid} = req.params;
      const product = await productManagerService.getProductsBy(pid)
      res.json({status: "success", payload: product});
    } catch (error) {
      res.json({ error: error });
    }
  });

  
  router.put('/:pid', async (req,res) => {
    try {
      const id = req.params.pid
      const {
        title,
        description,
        price,
        code,
        status,
        stock,
        category,    
      } = req.body;

      const updateProduct = {
        title,
        description,
        price,
        code,
        status,
        stock,
        category,   
      }

      const product = await productManagerService.getProductsBy({_id: id})
      if (!product) return res.status(404).send({status: "error", error: "Product doesn't exist"})
      const result = await productManagerService.updateProduct(id, updateProduct)
      res.send({status: "success", payload: result, message: "Product updated"})
      } catch (error) {
      res.json({ error: 'error' });     
      }
});
  
  router.delete("/:pid",async (req,res) => {
    try {
      const id = req.params.pid
      const result = await productsService.deleteProduct(id)
      res.send({status: "success", payload: result, message: "Product deleted"})

    } catch (error) {
      res.json({ error: 'error' });     
    }
});




export default router
