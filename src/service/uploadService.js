import multer from "multer";
import __dirname from "../utils.js";

// ALMACENAMIENTO PREVIO EN DISCO
const storage = multer.diskStorage({
    //Aquí tenemos el QUÉ, el CÓMO y el DÓNDE se guarda
    destination:function(req,file,callback){
        return callback(null,`${__dirname}/public/img`);
    },
    filename:function(req,file,callback){
        return callback(null,`${Date.now()}-${file.originalname}`)
    }
})




//ALMACENAMIENTO EN GOOGLE:
//Multer ya no tiene presencia en archivo, Sólo en MEMORIA
// const storage = multer.memoryStorage();

const uploader = multer({storage});

export default uploader;