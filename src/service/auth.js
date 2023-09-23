import bcrypt from "bcrypt";

const createHash = async (password) => {
   //Definir cantidad de rondas a mezclar para crear password 
   const salts = await bcrypt.genSalt(10) 

   return bcrypt.hash(password,salts);
}

const validatePassword = (password, hashedPassword) => {
    return bcrypt.compare(password,hashedPassword);
}

export default {
    createHash,
    validatePassword
}