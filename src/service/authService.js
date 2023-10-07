import bcrypt from "bcrypt";

const createHash = async (password) => {
   //Definir cantidad de rondas a mezclar para crear password 
   const salts = await bcrypt.genSalt(10) 
   return bcrypt.hash(password,salts);
}

const validatePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password,hashedPassword);
}

const extractAuthToken = (req) => {
    let token = null;
    if(req.cookies){
        token = req.cookies['authCookie']
    }
    return token
}
export default {
    createHash,
    validatePassword,
    extractAuthToken
}