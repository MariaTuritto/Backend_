import jwt from 'jsonwebtoken';
import BaseRouter from "./BaseRouter.js";
import passportCall from "../middleware/passportCall.js";
import config from "../config/config.js";


class SessionsRouter extends BaseRouter {
  init(){ 
    this.post('/register',['NO_AUTH'],passportCall('register', {strategyType:'LOCALS'}), async(req,res)=>{
      res.clearCookie('cart');
      res.sendSuccess('Registered');
    })
    this.post('/login', ['NO_AUTH'], passportCall('login', {strategyType:'LOCALS'}), async(req, res)=> {
      const tokenizedUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        id: req.user._id,
        role: req.user.role,
        cart: req.user.cart
      };
      const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {expiresIn:'1d'});
      res.cookie(config.jwt.COOKIE, token);
      res.clearCookie('cart');
      res.sendSuccess('Logged In');
    })
    this.get('/current',['AUTH'],async(req,res)=>{
      console.log(req.user);
      res.sendSuccessWithPayload(req.user);
  })
  }
}

const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();























// import { Router } from "express";
// // import passport from "passport";
// import jwt from "jsonwebtoken";
// import userManager from "../dao/mongo/managers/userManager.js"
// import auth from "../service/auth.js";
// import { validateJWT } from "../middleware/jwtExtractor.js";


// const router = Router();
// const userManagerService = new userManager();

// router.post('/login', async (req,res)=>{
//   const {email, password} = req.body;
//   if (!email || !password)
//   return res.status(400).send({status:"error", error: "Incomplete values" });
//   const user = await userManagerService.getUserBy({email})
//   if(!user) return res.status(400).send({status:"error", error: "Incorrect Credential"});
//   const isValidPassword = await auth.validatePassword(
//     password,
//     user.password
//   );
//   if (!isValidPassword) return res.status(400).send({status:"error", message: "Incorrect Credential"});
//   //SI SE LOGUEO CORRECTAMENTE, SE CREARÁ UN TOKEN:
//   const token = jwt.sign({id: user._id, email:user.email, role: user.role, name: user.firstName}, 
//     "secretjwt", 
//     {expiresIn:'1d'});
//     res.send({status:"succes", token})
// })

// router.get('/profileInfo', validateJWT, async (req, res) => {
//   //Endpoint que me va a halar la info del token 
//   console.log(req.user);
//   res.send({status: 'succes', payload: req.user})
// })

// export default router;
