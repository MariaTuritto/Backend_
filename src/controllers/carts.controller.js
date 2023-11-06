import {
  cartService,
  productsService,
  ticketService,
  userService,
} from "../service/index.js";

//falta corregir y agregar logicas

const getCartBy = async (req, res) => {
  const { cid } = req.params;
  const cart = await cartService.getCartBy({ _id: cid }, { populate: true });
  if (!cart)
    return res.status(404).send({ status: "error", message: "cart not found" });
  res.send({ status: "success", payload: cart });
};

const createCart = async (req, res) => {
  const cart = await cartService.createCart();
  res.send({ status: "success", payload: cart._id });
};





const updateCart = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await cartService.getCartBy({ cid, pid }, { populate: false });
  if (!cart)
    return res
      .status(400)
      .send({ status: "error", message: "Cart doesn't exist" });

  const productExists = await productsService.getProductsBy({ _id: pid });
  if (!productExists)
    return res
      .status(400)
      .send({ status: "error", message: "Product doesn't exist" });

  const productExistInCart = cart.products.find((item) => {
    return item.product.toString() === pid;
  });

  if (!productExistInCart) {
    cart.products.push({ product: pid, quantity: 1 });
  } else {
    productExistInCart.quantity++;
  }
  await cartService.updateCart(cid, {
    products: cart.products,
    quantity: cart.quantity,
  });
  res.send({ status: "success", payload: cart });
};





const updateInCartProductQuantity = async (req, res) => {
  const { pid, cid } = req.params;
  const quantity = req.body;

  const cart = await cartService.getCartBy({ _id: cid });
  if (!cart)
    return res.status(400).send({ status: "error", message: "cart not found" });

  const productExists = await productsService.getProductsBy(pid);
  if (!productExists)
    return res
      .status(400)
      .send({ status: "error", message: "Product does not exist" });

  const productExistInCart = cart.products.find((item) => {
    return item.product.toString() === pid;
  });
  if (!productExistInCart)
    return res
      .status(400)
      .send({ status: "error", message: "Product does not exist in cart" });

  await cartService.updateInCartProductQuantity(cid, pid, quantity);
  res.send({ status: "success", payload: "Quantity product updated" });
};





const addProdToCart = async (req, res) => {
  const { cid } = req.params;
  const newProducts = req.body;
  const cart = await cartService.getCartBy({ _id: cid }, { populate: false });
  if (!cart)
    return res.status(400).send({ status: "error", message: "Cart not found" });

  await cartService.updateCart(cid, newProducts);
  res.send({ status: "success", payload: "Cart updated with new products" });
};





const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const { user, products } = req.body;

  const cart = await cartService.getCartBy({ _id: cid }, { populate: true });
  if (!cart)
    return res.status(400).send({ status: "error", message: "Cart not found" });

  //obtener stock de productos add al cart
  const purchasedProd = [];

  for (const item of cart.products) {
    const pid = cart.product._id;
    const productExists = await productsService.getProductsBy(pid);

    if (!productExists)
      return res
        .status(400)
        .send({ status: "error", message: "Product does not exist" });
    if (productExists.stock >= item.quantity)
    purchasedProd.push(item);
    //falta logica de actualizar los productos no comprados
  }
  const resultUser = await userService.getUserBy(user);
  const resultProducts = await productsService.getProductsBy(products);

  let actualTicket = resultProducts.products.filter((product) =>
    products.includes(product._id)
  );

  let sum = actualTicket.reduce((acc, prev) => {
    acc += prev.price;
    return acc;
  }, 0);

  let codeTicket = Date.now() + Math.floor(Math.random() * 10000 + 1);

  let newTicket = {
    code: codeTicket,
    amount: sum,
    purchaser: "correocliente@gmail.com",
    products: actualTicket.map((product) => product._id),
  };

  const ticketResult = await ticketService.createTicket(newTicket);
  resultUser.tickets.push(ticketResult._id);
  await userService.updateUser(user, resultUser);
  res.send({ status: "success", ticketResult });
};




const deleteProdFromCart = async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await cartService.getCartBy({ _id: cid });
  if (!cart)
    return res.status(400).send({ status: "error", message: "cart not found" });

  const productExists = await productsService.getProductsBy(pid);
  if (!productExists)
    return res
      .status(400)
      .send({ status: "error", message: "Product does not exist" });

  const productExistInCart = cart.products.find((item) => {
    return item.product.toString() === pid;
  });
  if (!productExistInCart)
    return res
      .status(400)
      .send({ status: "error", message: "Product does not exist in cart" });

  await cartService.deleteProdFromCart(cid, pid);
  res.send({ status: "success", message: "Product deleted" });
};




const deleteCart = async (req, res) => {
  const { cid } = req.params;
  const cart = await cartService.findOne({ _id: cid });
  if (!cart)
    return res.status(400).send({ status: "error", message: "cart not found" });
  await cartService.deleteCart(cid);
  res.send({ status: "success", message: "cart deleted successfully" });
};

export default {
  getCartBy,
  createCart,
  updateCart,
  updateInCartProductQuantity,
  addProdToCart,
  purchaseCart,
  deleteProdFromCart,
  deleteCart,
};


















// const cart = await cartService.getCartBy({_id:cid}, {populate:true});
// if (!cart) return res.status(400).send({status: "error", message: "Cart not found"})

// const purchaseProd = []
// let sumTotal = 0

// for (const item of cart.products) {
//   let product = item.product
//   let quantity = item.quantity
//   let stock = product.stock
//   let amount = product.price

//   if (quantity <= stock) {
//     let newStock = stock - quantity

//     purchaseProd.push(item);
//     console.log(`Producto ${product.code} agregado exitosamente`);

//     sumTotal += amount

//   } else {
//     console.log(`El producto ${product.code} esta agotado`);
//   }
// }
// const codeTicket = Date.now().toString(15);

// const newTicket = {
//   code: codeTicket,
//   amount: sumTotal,
//   purchaser: "correocliente@gmail.com"
// }
// console.log(newTicket);

// const ticketResult = await ticketService.createTicket(newTicket)
// if (ticketResult)
// res.status(200).send({status: "success", message: "Your order has been purchased!"})
