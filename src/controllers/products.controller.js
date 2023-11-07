import CloudStorageService from "../service/CloudStorageService.js";
import {productsService} from "../service/index.js";
import uploader from "../service/uploadService.js";


const getPaginateProducts = async (req,res) => {

    const products = await productsService.getPaginateProducts({}, {page: 1, limit: 5});
    res.send({status:"succes", payload: products})
  
}

const getProductsBy = async (req,res) => {

    const id = parseInt(req.params.pid);
    const product = await productsService.getProductsBy(id);
    if(product === 'Not found') {
        res.status(400).json({message:'Product not found'});
    } else if(product) {
        res.status(200).json(product)
    } else {
        res.status(400).json({message:'Product not found'})
    }
};

const createProduct = (uploader.array('thumbnail'), async (req,res) => {
    
    const {
          title,
          description,
          price,
          code,
          status,
          stock,
          category,
      } = req.body
  
      if (!title || !description || !price ||  !code || !stock || !category) 
        return res.status(400).send({status: "error", message: "Incomplete values" })
      
      const newProduct = {
        title,
        description,
        price,
        code,
        status,
        stock,
        category
      }
      //NO ME AGREGA LOS PRODUCTOS AL SERVIDOR-ERROR INCOMPLETE VALUES EN POSTMAN 
      //DONDE METO EL UPLOADER.ARRAY(THUMBNAIL)????
      //NO SÉ SI ASI ES LO CORRECTO :
      const googleStorageService = new CloudStorageService(file);
     
      const thumbnail = []
      
      for(const file of req.files){
        const url = await googleStorageService.uploadFileCloudStorage(file);
        thumbnail.push(url)
      }
      console.log(thumbnail)

      newProduct.thumbnail = thumbnail
      const result = await productsService.createProduct(newProduct)
      res.send({status: "success", payload: result._id});
      res.sendStatus(200)
});

const updateProduct = async (req,res)=>{
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
  }

  const deleteProduct = async(req,res) => {
    const {pid} = req.params
    const product = await productsService.getProductsBy(pid);
    if (!product) return res.status(400).send({status: "error", error: "Product doesn't exist"});
    await productsService.deleteProduct(pid);
    res.send({status: "success", message: "Product deleted"})
    
  }

export default {
    getPaginateProducts,
    getProductsBy,
    createProduct,
    updateProduct,
    deleteProduct
}