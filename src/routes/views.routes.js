import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js";
import { getValidFilters } from "../utils.js";
import cartManager from "../dao/mongo/managers/cartManager.js";

const router = Router();
const productManagerService = new productManager();
const cartManagerService = new cartManager();

//ACTUALIZACIÓN CON JWT
router.get("/", async (req, res) => {
  try {

    let {page=1, limit=3, sort, order =1, ...filters} = req.query;
    const cleanFilters = getValidFilters(filters, 'product')
    console.log(cleanFilters)
    let sortResult= {}
    if(sort) {
      sortResult[sort] = order
    }
    const pagination = await productManagerService.getPaginateProducts(cleanFilters, {page, lean:true, limit, sort:sortResult})
    console.log(pagination)

    res.render('home', {
      css: 'home',
      products: pagination.docs,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage,
      page: pagination.page
    })

  } catch (error) {
    res.json({ error: error });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const carrito_id = req.params.cid;
  const filter = { _id: carrito_id };
  const cart = await cartManagerService.getCartsBy(filter);

  res.render('carts', {cart});
});



router.get('/', async (req,res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login')
    }
    res.render('profile', {user: req.session.user})
  } catch (error) {
    res.json({ error: error });
  }
})

router.get('/register', async (req,res) => {
  
  try {
    res.render('register')
  } catch (error) {
    res.json({ error: error });
  }
})

router.get('/login', async (req,res) => {

  try {
    res.render('login')
  } catch (error) {
    res.json({ error: error });
  }
})

// router.get('/profilejwt', async(req,res)=>{
//   res.render('profileJWT')
// })

export default router;
