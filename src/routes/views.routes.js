import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js";
import cartManager from "../dao/mongo/managers/cartManager.js";

const router = Router();

const productManagerService = new productManager();
const cartManagerService = new cartManager();

router.get("/", async (req, res) => {
  try {
    const paginationResult = await productManagerService.getProducts();

    const products = paginationResult.docs;
    const currentPage = paginationResult.page;
    const { hasPrevPage, hasNextPage, prevPage, nextPage } = paginationResult;

    res.render("home", {
      products,
      page: currentPage,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    });
  } catch (error) {
    res.json({ error: error });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const carrito_id = req.params.cid;
  const filter = { _id: carrito_id };
  const cart = await cartManagerService.getCartsBy(filter);

  res.render("Carts", {
    cart,
  });
});

router.get("/realtimeproducts", async (req, res) => {
  const realTimePro = await productManagerService.getProducts();
  res.render("realtimeproducts", { realTimePro });
});

router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.get("/login", async (req, res) => {
  res.render("login");
});

export default router;
