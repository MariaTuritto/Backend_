import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import userManager from "../dao/mongo/managers/userManager.js";
import authService from "../service/authService.js";

const usersManagerService = new userManager();

const initializeStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email", session: false },

      async (req, email, password, done) => {
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
        const result = await usersManagerService.createUser(newUser);
        return done(null, result);
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email", session: false },
      async (email, password, done) => {
        try {
          //   if(email===config.app.ADMIN_EMAIL&&password===config.app.ADMIN_PASSWORD){
          //     const adminUser = {
          //         role:'admin',
          //         id:'0',
          //         firstName:'admin'
          //     }
          //     return done(null,adminUser);
          // }
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
