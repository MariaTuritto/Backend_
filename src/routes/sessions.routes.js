import { Router } from "express";
import userManager from "../dao/mongo/managers/userManager.js";

const router = Router();
const userManagerService = new userManager();

router.post('/register', async (req, res) => {
    const {
        firstName, 
        lastName, 
        email, 
        password
    } = req.body
if(!firstName|| !lastName || !email || !password) return res.status(400).send({status:"error", error: "Incomplete values"})

const newUser = {
    firstName,
    lastName,
    email,
    password
};
const result = await userManagerService.createUser(newUser);

res.status(200).send({status:"succes", payload:result._id});

}) 

router.post('/login', async(req,res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).send({status:"error", error:"Incomplete values"})

    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        const adminUser = {
            firstName: "Admin1",
            lastName: "LastAdmin1",
            email:"adminCoder@coder.com",
            role: "admin"
        }
        req.session.user = adminUser
        res.send({status:"succes", message:"Admin login"})
        return
    }

    const user = await userManagerService.getUserBy({email,password});
    if(!user) return res.status(400).send({status:"error", error: "Incorrect Credentials"})

    req.session.user = user;
    res.status(200).send({status:"succes", message:"Correct login"});
})

router.get('/logout', async(req,res) => {
    req.session.destroy(error =>{
        if(error) {
            console.log(error);
            return res.redirect('/');
        }else{
            res.redirect('/')
        }
    })
})


export default router;