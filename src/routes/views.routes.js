import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js";
import cartManager from "../dao/mongo/managers/cartManager.js";

const router = Router();
const productManagerService = new productManager();
const cartManagerService = new cartManager();

router.get("/", async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || 'asc';
    const category = req.query.category || null; 
    const status = req.query.status || null;
    
    const queryObj = {};

    if(category) queryObj.category = category;
    if(status) queryObj.status = status; 

    const paginationResult = await productManagerService.getProductsV(page,limit,queryObj,sort);
    const products = paginationResult.docs;
    const currentPage = paginationResult.page;
    const { hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = paginationResult;
    const {user} = req.session

    let roleUser = null

    if (user.role === "user") {
      roleUser = true 
    }
 
    res.render("home", {
      user,
      roleUser,
      products,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      totalPages
    });

  } catch (error) {
    res.json({ error: error });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const carrito_id = req.params.cid;
  const filter = { _id: carrito_id };
  const cart = await cartManagerService.getCartsBy(filter);

  res.render("Carts", { cart});
});

router.get("/realtimeproducts", async (req, res) => {
  const realTimePro = await productManagerService.getProducts();
  res.render("realtimeproducts", { realTimePro });
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
    res.render('register', {})
  } catch (error) {
    res.json({ error: error });
  }
})

router.get('/login', async (req,res) => {

  try {
    res.render('login',{})
  } catch (error) {
    res.json({ error: error });
  }
})

export default router;
