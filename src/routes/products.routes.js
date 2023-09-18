import {Router} from 'express';
import productManager from '../dao/mongo/managers/productManager.js';
import uploader from '../service/uploadService.js';


const productManagerService = new productManager();
const router = Router();


router.get("/", async (req, res) => {

    try {
  
    const {limit, page, sort, category} = req.query
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: {price: Number(sort)}
    };

    if (!(options.sort.price === -1 || options.sort.price === 1)) {
      delete options.sort
    }

    const categories = await productManagerService.categories();

    const result = categories.some( cat => cat === category)

    if (result)
    {
      const paginationResult = await productManagerService.getProducts({category}, options)

      
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

    }
  //si no hago ningun filter por categoria entonces: 
  
    const paginationResult = await productManagerService.getProducts({}, options);

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
        thumbnail,
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
