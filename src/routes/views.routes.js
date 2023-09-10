import { Router } from "express";
import productManager from "../dao/mongo/managers/productManager.js";
// import __dirname from "../utils.js";

const router = Router();
// const cartManagerService = new cartManager();
const productManagerService = new productManager();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const paginationResult = await productManagerService.getProducts(
      page,
      limit
    );

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

export default router;
