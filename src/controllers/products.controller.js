import CloudStorageService from "../service/CloudStorageService.js";
import {productsService} from "../service/index.js";
import { generateProducts } from "../mocks/products.js";
import ErrorsDictionary from "../dictionaries/errors.js";
import errorCodes from "../dictionaries/errorCodes.js";



const getPaginateProducts = async (req,res, next) => {
  try{
    const products = await productsService.getPaginateProducts({}, {page: 1, limit: 5});
   return res.send({status:"succes", payload: products})
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



const getProductsBy = async (req,res,next) => {
    try{
      const {pid}= parseInt(req.params.pid);
      const product = await productsService.getProductsBy(pid);
      if(product === 'Not found') {
        req.logger.warning(
          `[${new Date().toISOString()}] Product not exist`
        );
          res.status(400).json({message:'Product not found'});
      } else if(product) {
          res.status(200).json(product)
      } else {
        req.logger.warning(
          `[${new Date().toISOString()}] Product not exist`
        );
          res.status(400).json({message:'Product not found'})
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



const createProduct = async (req, res, next) => {
  try{
    const {
      title,
      description,
      price,
      code,
      status,
      stock,
      category,
  } = req.body

  if (!title || !description || !price ||  !code || !stock || !category) {
    req.logger.warning(`[${new Date().toISOString()}] Alert: product incomplet}`);
    return res.status(400).send({status: "error", message: "Incomplete values" })
  }

         
  const newProduct = {
    title,
    description,
    price,
    code,
    status,
    stock,
    category
  }

  const googleStorageService = new CloudStorageService();
  const thumbnail = []
  for(const file of req.files){
    const url = await googleStorageService.uploadFileCloudStorage(file);
    thumbnail.push(url)
  }
  console.log (thumbnail)
  
  newProduct.thumbnail = thumbnail
  console.log(newProduct)

  const result = await productsService.createProduct(newProduct)
  req.logger.info(`[${new Date().toISOString()}] product successfully added`);
  res.send({status: "success", payload: result._id});

  }catch (error) {
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



const updateProduct = async (req,res,next)=>{
  try{
    const {pid} = req.params;
    const {
      title,
      description,
      price,
      code,
      status,
      stock,
      category,
      thumbnail    
    } = req.body;
//Objeto de actualización
    const updateProduct = {
      title,
      description,
      price,
      code,
      status,
      stock,
      category, 
      thumbnail  
    }
//El Producto existe? lo validamos
    const product = await productsService.getProductsBy({_id:pid});
    if (!product) return res.status(400).send({status: "error", error: "Product doesn't exist"});
    await productsService.updateProduct(pid, updateProduct)
    res.send({status: "success", message: "Product updated"})
  }catch (error) {
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

  const deleteProduct = async(req,res,next) => {
    try{
      const {pid} = req.params
      const product = await productsService.getProductsBy(pid);
      if (!product) {
        req.logger.warning(`[${new Date().toISOString()}]  Product with id ${pid} doesn't exist`);
      return res.status(400).send({status: "error", error: "Product doesn't exist"});
      }      
      await productsService.deleteProduct(pid);
      res.send({status: "success", message: "Product deleted"})
      
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


  const mockingProducts = async (req, res, next) => {
    try {
      const products = [];
      for (let i = 0; i < 100; i++) {
        const mockProduct = generateProducts();
        products.push(mockProduct);
      }
      return res.send({ status: "success", payload: products });
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
    getPaginateProducts,
    getProductsBy,
    createProduct,
    updateProduct,
    deleteProduct,
    mockingProducts
}