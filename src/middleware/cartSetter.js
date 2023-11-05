import CartsDao from "../dao/mongo/managers/cartsDao.js";

const cartsService = new CartsDao()

const cartSetter = async (req,res,next) => {
    if(!req.cookies.cart&&!req.user) {
        const cart = await cartsService.createCart()
        res.cookie('cart', cart._id.toString())
    }
    next()
}

export default cartSetter