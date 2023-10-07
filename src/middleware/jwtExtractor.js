// import jwt from "jsonwebtoken";

// export const validateJWT = (req,res,next) =>  {
//     //Cómo extraer el header, primero no llegarán 2 datos: Bearer + token
//     const authHeader = req.headers.authorization;
//     //validamos y verificamos que no llegue vacio
//     if(!authHeader) return res.status(401).send({status:'error', error:'Not logged'});
//     //En caso de recibir el header, debo descifrar el token. Lo rompemos y lo extraemos
//     const token = authHeader.split(' ')[1]; 
//     //Bearer [0] jakshaddjhdjakbwt[1], al aplicar este split te traes el token que se encuentra en posición 1.
//     //Luego lo vamos a verificar:
//     try {
//         const userInfo = jwt.verify(token, 'secretjwt');
//         req.user = userInfo;
//         next();
//     } catch (error){
//         console.log(error);
//         res.status(401).send({status: 'error', error:'Token Error'})
//     }
    
// }