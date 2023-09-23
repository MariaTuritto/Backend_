import passport from "passport";
import local from "passport-local";
import GithubStrategy from "passport-github2";
import userManager from "../dao/mongo/managers/userManager.js";
import auth from "../service/auth.js";

//Estrategia local, sólo en este caso utilizaremos registro y login, se suele usar solo el login.
const LocalStrategy = local.Strategy;

const userManagerService = new userManager();

const initializeStrategies = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        //INGRESAMOS LA LOGICA TRAIDA DE REGISTRO y ADAPTAMOS A PASSPORT:
        const { firstName, lastName } = req.body;
        //Con done validamos
        if (!firstName || !lastName || !email || !password)
          return done(null, false, { message: "Incomplete values" });
        //Al pasar la validación, se creará el hasheo:
        const hashedPassword = await auth.createHash(password);
        //Y luego lo insertamos en el password del newUser:
        const newUser = {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        };
        const result = await userManagerService.createUser(newUser);
        //Con done tambien enviamos la respuesta como haciamos con send, pero diferente estructura
        done(null, result);
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        if (!email || !password)
          return done(null, false, { message: "Incomplete values" });

        const user = await userManagerService.getUserBy({ email });

        if (!user)
          return done(null, false, { message: "Incorrect Credentials" });
        //Se va a comparar la nueva contraseña hasheada con la que el usuario ingresa al registrarse:
        const isValidPassword = await auth.validatePassword(
          password,
          user.password
        );
        if (!isValidPassword)
          return done(null, false, { message: "Incorrect Credentials" });

        //Aqui no usaremos req para traer el usuario, solo con done es suficiente:
        done(null, user);
      }
    )
  );

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: "Iv1.403231694734a184",
        clientSecret: "bd8e666eb73d4a86c880805cdfe8307a30ccd733",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const { email, name } = profile._json;

        //Validaciónes:
        const user = await userManagerService.getUserBy({ email });
        if (!user) {
          //si no existe user, lo creamos:
          const newUser = {
            firstName: name,
            email,
            password: "",
          };
          const result = await userManagerService.createUser(newUser);
          done(null, result);
        } else {
          //Si el user existe, lo traemos de la base de datos:
          done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userManagerService.getUserBy({ _id: id });
    done(null, user);
  });
};

export default initializeStrategies;
