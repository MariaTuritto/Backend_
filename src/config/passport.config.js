import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import userManager from "../dao/mongo/managers/userManager.js";
import authService from "../service/authService.js";
import cartManager from "../dao/mongo/managers/cartManager.js";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20" 
import config from "./config.js"

const cartManagerService = new cartManager();
const usersManagerService = new userManager();

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
        const existsUser = await usersManagerService.getUserBy({ email });
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

        //Se agrega el método para agregar al usuario su cart:
        let cart;
        if(req.cookies['cart']){ //te trae la cart que existe en la cookie
          cart = req.cookies['cart'];
        }else{ //Si no existe la cookie, la vamos a crear en la base de datos
          cartResult = await cartManagerService.createCart();
          cart = cartResult._id
        }

        newUser.cart = cart;

        const result = await usersManagerService.createUser(newUser);
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
                  firstName:'admin'
              }
              return done(null,adminUser);
          }
          //Verificar si el usuario existe
          const user = await usersManagerService.getUserBy({ email });
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

// passport.use('google', new GoogleStrategy(
//   {
//       clientID:"682700092334-ls46chnjrekrkvp7lr6907m5posodi02.apps.googleusercontent.com",
//       clientSecret:"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",
//       callbackURL:"http://localhost:8080/api/sessions/googlecallback",
//   },async(accessToken, refreshToken, profile, done) => 
//   {
//       try 
//       {
//           const { _json } = profile;
//           const user = await usersManagerService.getUserBy({ email: _json.email });
    
//           if (user) return done(null, user); //se encontro en la bd un usuario con el email ingresado.
//           else 
//           {
//               //caso contrario, creo usuario y agrego a bd (o persistencia seleccionada)
//               const newUser = {firstName: _json.given_name,lastName: _json.family_name,email: _json.email};
//               const createdUser = await usersServices.create(newUser);
            
//               if (createdUser) return done(null, createdUser);
//               else return done(new Error('Error al crear el usuario'), null);
//           }
//       } catch (error){ return done(error, null);}
//   }));
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
