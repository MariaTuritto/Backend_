import BaseRouter from './BaseRouter.js';
import productsController from '../controllers/products.controller.js';

class ProductsRouter extends BaseRouter {
  init(){
    this.get('/',['PUBLIC'], productsController.getPaginateProducts);

    this.get('/:pid', ['PUBLIC'], productsController.getProductsBy);
    
    this.post('/', ['ADMIN'], productsController.createProduct)

    this.put('/:pid', ['ADMIN'], productsController.updateProduct)

    this.delete('/:pid', ['ADMIN'], productsController.deleteProduct)
  }
}

const productsRouter = new ProductsRouter();

export default productsRouter.getRouter();






























// //Obtener todos los productos
// router.get("/", async (req, res) => {
//     try {
//   const products = await productManagerService.getProducts();
//   res.send({status:"succes", payload: products})

//     } catch (error) {
//       res.json({ error: error });
//     }
//   });
// //Enviar los productos a la DataBase
//   router.post("/", uploader.array('thumbnail'), async (req, res) => {
//    console.log(req.files)
//     try {
//       const {
//         title,
//         description,
//         price,
//         code,
//         status,
//         stock,
//         category,
//       } = req.body;

//       if (!title || !description || !price ||  !code || !stock || !category) {
//         res.status(400).send({status: "error", message: "Incomplete values" })
//       }
//       const newProduct = {
//         title,
//         description,
//         price,
//         code,
//         status,
//         stock,
//         category,
//       }
      
//       const thumbnail = req.files.map(file=>`${req.protocol}://${req.hostname}:${process.env.PORT||8080}/img/${file.filename}`);
//       newProduct.thumbnail = thumbnail; 
//       //Se crea el objeto, se mapean las imagenes y luego se insertan en la dataBase
//       const result = await productManagerService.addProducts(newProduct)
//       res.send({status: "success", payload: result._id});
//     } catch (error) {
//       res.status(400).json({ error: "error addProducts" });
//     }
//   });

//Obtener el producto por su id
  // router.get("/:pid", async (req, res) => {
  //   try {
  //     const {pid} = req.params;
  //     const product = await productManagerService.getProductsBy(pid)
  //     res.json({status: "success", payload: product});
  //   } catch (error) {
  //     res.json({ error: error });
  //   }
  // });

//   //Actualizar productos con tal id
//   router.put('/:pid', async (req,res) => {
//     try {
//       const {pid} = req.params;
//       const {
//         title,
//         description,
//         price,
//         code,
//         status,
//         stock,
//         category,    
//       } = req.body;

//       const updateProduct = {
//         title,
//         description,
//         price,
//         code,
//         status,
//         stock,
//         category,   
//       }

//       const product = await productManagerService.getProductsBy({_id:pid});
//       if (!product) return res.status(400).send({status: "error", error: "Product doesn't exist"});
//       await productManagerService.updateProduct(pid, updateProduct)
//       res.send({status: "success", message: "Product updated"})
//       } catch (error) {
//       res.json({ error: 'error' });     
//       }
// });
  
//   router.delete("/:pid",async (req,res) => {
//     try {
//       const {pid} = req.params
//       const result = await productManagerService.deleteProduct(pid)
//       res.send({status: "success", message: "Product deleted"})

//     } catch (error) {
//       res.json({ error: 'error' });     
//     }
// });





