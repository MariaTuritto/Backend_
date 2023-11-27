import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userDao from "../dao/mongo/managers/usersDao.js";
import cartDao from "../dao/mongo/managers/cartsDao.js";
import authService from "../service/authService.js";
import config from "./config.js"

const cartService = new cartDao();
const usersService = new userDao();

const initializeStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email", session: false },

      async (req, email, password, done) => {
        try{
          const { firstName, lastName } = req.body;
        if (!firstName || !lastName)
          return done(null, false, { message: "Incomplete values" });

        const existsUser = await usersService.getUserBy({ email });
        if (existsUser)
          return done(null, false, { message: "User already exist" });
        //Aplicar hash a la constraseña del usuario:
        const hashedPassword = await authService.createHash(password);
        //Crear usuario:
        const newUser = {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        };

        //Se agrega el método para agregar al usuario su cart temporal:
        let cart;
        if(req.cookies['cart']){ //te trae la cart que existe en la cookie
          cart = req.cookies['cart'];
        }else{ //Si no existe la cookie, la vamos a crear en la base de datos
          const cartResult = await cartService.createCart();
          cart = cartResult._id
        }

        newUser.cart = cart;

        const result = await usersService.createUser(newUser);
        return done(null, result);
        }  catch (error) {
          console.log(error);
          return done(error);
        }
        
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
            if(email===config.app.ADMIN_EMAIL&&password===config.app.ADMIN_PASSWORD){
              const adminUser = {
                  role:'admin',
                  id:'0',
                  firstName:'admin',
                  lastName:'lastAdmin',
                  email:'correoadmin@correo.com'
              }
              return done(null,adminUser);
          }
          //Verificar si el usuario existe
          const user = await usersService.getUserBy({ email });
          if (!user)
            return done(null, false, { message: "Inavalid Credentials" });
          const isValidPassword = await authService.validatePassword(
            password,
            user.password
          );
          if (!isValidPassword)
            return done(null, false, { message: "Invalid Credentials" });
          return done(null, user);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );
//LOGICA PARA INICIAR SESION CON GOOGLE
passport.use('google', new GoogleStrategy(
  {
      clientID: config.google.CLIENT_ID ||"604613985429-tsv68l2q5uhm6k8gafkigvuged903kk5.apps.googleusercontent.com",
      clientSecret: config.google.CLIENT_SECRET ||"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",
      callbackURL:"http://localhost:8080/api/sessions/googlecallback",
      passReqToCallback:true,
  },
  async(req,accessToken, refreshToken, profile, done) => {
      
      try 
      {
          const { _json } = profile;
          const user = await usersService.getUserBy({ email: _json.email });
          if (user) return done(null, user); //si existe el usuario, devuelvelo
          else 
          { //caso contrario, creo usuario y agrego a bd (o persistencia seleccionada)
              const newUser = {
                firstName: _json.given_name,
                lastName: _json.family_name,
                email: _json.email
              };
              //AQUI REPLICAMOS LA CREACIÓN DE UN CARRITO PARA EL USUARIO AL CREARSE EL REGISTRO DEL USUARIO CON GOOGLE
              let cart;

              if(req.cookies['cart']){//Obtener la que ya está de la cookie
                  cart = req.cookies['cart'];
              }else{ //Crear una nueva librería en la base de datos
                  cartResult = await cartService.createcart();
                  cart = cartResult._id
              }
              newUser.cart = cart;

              const createdUser = await usersService.createUser(newUser);

              if (createdUser) return done(null, createdUser);
                else return done(new Error('Error al crear el usuario'), null);
          }
      } catch (error){ return done(error, null);}
  }));



  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          authService.extractAuthToken,
        ]),
        secretOrKey: "jwtSecret",
      },
      async (payload, done) => {
        return done(null, payload);
      }
    )
  );
};

export default initializeStrategies;
