import {Router} from 'express';
import productManager from '../dao/mongo/managers/productManager.js';
// import uploader from '../service/uploadService.js';
// import __dirname from '../utils.js';

const productManagerService = new productManager();
const router = Router();

router.get('/aggregate', async (req, res)=> {
  try {
    const aggregateResult = await productManagerService.getProductsAgg();
    res.send({status: 'succes' , payload: aggregateResult})
  } catch (error) {
    res.json({ error: error });
  }
})

router.get("/", async (req, res) => {
    try {
    const {page = 1,limit = 10} = req.query
    const paginationResult = await productManagerService.getProducts(page,limit)

    const products = paginationResult.docs;
    const currentPage = paginationResult.page;
    const {hasPrevPage, hasNextPage, prevPage, nextPage,totalDocs,totalPages} = paginationResult;

    const baseUrl = `${req.protocol}://${req.hostname}:${process.env.PORT || 8080}${req.baseUrl}`
    const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}` : null
    const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}` : null

    const paginationData = {
      currentPage,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      totalDocs,
      totalPages,
      prevLink,
      nextLink
    }

    res.send({status: "success", payload: products, ...paginationData})
    } catch (error) {
      res.json({ error: error });
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

  router.post("/", async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        thumbnail,
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
        thumbnail,
        code,
        status,
        stock,
        category,
      }
      
      const result = await productManagerService.addProducts(newProduct)
      res.send({status: "success", payload: result._id});
    } catch (error) {
      res.status(400).json({ error: "error addProducts" });
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
      res.json({ error: error.message });     
      }
});
  
  router.delete("/:pid",async (req,res) => {
    try {
      const id = req.params.pid
      const result = await productsService.deleteProduct(id)
      res.send({status: "success", payload: result, message: "Product deleted"})
    } catch (error) {
      res.json({ error: error.message });     
    }
});




export default router
