import CartsManager from "../dao/mongo/managers/cartManager.js";

const cartsManagerService = new CartsManager()

const cartSetter = async (req,res,next) => {
    if(!req.cookies.cart&&!req.user) {
        const cart = await cartsManagerService.createCart()
        res.cookie('cart', cart._id.toString())
    }
    next()
}

export default cartSetter