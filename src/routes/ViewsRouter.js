import BaseRouter from "./BaseRouter.js"
import productManager from "../dao/mongo/managers/productManager.js";
import { getValidFilters } from "../utils.js";



const productManagerService = new productManager();


//ACTUALIZACIÓN CON BASEROUTER
class ViewsRouter extends BaseRouter {
init(){
  this.get('/register',['NO_AUTH'], async(req,res)=>{
    res.render('register')
  })
  this.get('/login',['NO_AUTH'],async(req,res)=>{
    res.render('login');
})
this.get('/',['PUBLIC'], async(req,res)=>{
  let{page=1,limit=4,sort,order=1,...filters} = req.query;
  const cleanFilters = getValidFilters(filters, 'product');
  let sortResult ={}
  if(sort){
    sortResult[sort]= order
  }
  const paginationResult = await productManagerService.getPaginateProducts(cleanFilters, {page,lean:true,limit,sort:sortResult})

  res.render('productos',{
    products: paginationResult.docs,
    hasNextPage: paginationResult.hasNextPage,
    hasPrevPage: paginationResult.hasPrevPage,
    nextPage: paginationResult.nextPage,
    prevPage: paginationResult.prevPage,
    page: paginationResult.page,
  });
});
}
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();









































































// router.get("/", async (req, res) => {
//   try {

//     let {page=1, limit=3, sort, order =1, ...filters} = req.query;
//     const cleanFilters = getValidFilters(filters, 'product')
//     console.log(cleanFilters)
//     let sortResult= {}
//     if(sort) {
//       sortResult[sort] = order
//     }
//     const pagination = await productManagerService.getPaginateProducts(cleanFilters, {page, lean:true, limit, sort:sortResult})
//     console.log(pagination)

//     res.render('home', {
//       css: 'home',
//       products: pagination.docs,
//       hasNextPage: pagination.hasNextPage,
//       hasPrevPage: pagination.hasPrevPage,
//       nextPage: pagination.nextPage,
//       prevPage: pagination.prevPage,
//       page: pagination.page
//     })

//   } catch (error) {
//     res.json({ error: error });
//   }
// });

// router.get("/carts/:cid", async (req, res) => {
//   const carrito_id = req.params.cid;
//   const filter = { _id: carrito_id };
//   const cart = await cartManagerService.getCartsBy(filter);

//   res.render('carts', {cart});
// });



// router.get('/', async (req,res) => {
//   try {
//     if (!req.session.user) {
//       return res.redirect('/login')
//     }
//     res.render('profile', {user: req.session.user})
//   } catch (error) {
//     res.json({ error: error });
//   }
// })

// router.get('/register', async (req,res) => {
  
//   try {
//     res.render('register')
//   } catch (error) {
//     res.json({ error: error });
//   }
// })

// router.get('/login', async (req,res) => {

//   try {
//     res.render('login')
//   } catch (error) {
//     res.json({ error: error });
//   }
// })

// router.get('/profilejwt', async(req,res)=>{
//   res.render('profileJWT')
// })


