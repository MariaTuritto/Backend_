import jwt from "jsonwebtoken";
import BaseRouter from "./BaseRouter.js";
import passportCall from "../middleware/passportCall.js";
import config from "../config/config.js";
import MailingService from "../service/mailingService.js";

class SessionsRouter extends BaseRouter {
  init() {
    this.post(
      "/register",
      ["NO_AUTH"],
      passportCall("register", { strategyType: "LOCALS" }),
      async (req, res) => {
        res.clearCookie("cart");
        res.sendSuccess("Registered");
        return res.redirect("profile");
      }
    );
    this.post(
      "/login",
      ["NO_AUTH"],
      passportCall("login", { strategyType: "LOCALS" }),
      async (req, res) => {
        const tokenizedUser = {
          name: `${req.user.firstName} ${req.user.lastName}`,
          id: req.user._id,
          role: req.user.role,
          cart: req.user.cart,
        };
        const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
          expiresIn: "1d",
        });
        res.cookie(config.jwt.COOKIE, token);
        res.clearCookie("cart");
        res.sendSuccess("Logged In");
      });

        //APLICANDO NODE MAILER:
        this.get("/mails", async (req, res) => {
          const mailService = new MailingService();
          //ENVIAMOS CORREO:
          const mailRequest = {
            from: "YO MISMO",
            to: ["turittomaria@gmail.com"], //recuerda incrustar en html el css
            subject: "PRUEBA MAIL",
            html: `
      <div>
      <h1>Bienvenido a Myecommerce</h1>
      <br/>
      <p>Gracias por suscribirte, te damos la bienvenida con un cupón de descuento en tu próxima compra</p>
      <br/>
      <imag src="cid:mailing"/>
      </div>
      `,
            attachments: [
              {
                filename: "mailing.png",
                path: __dirname + "img/mailing.png",
                cid: "mailing",
              },
            ],
          };

          const mailResult = await mailService.sendMail(mailRequest);
          console.log(mailResult);
    //FALTARIA AGREGAR ESTA LÓGICA AL REGISTRASE O AL FINALIZAR LA COMPRA
      });

    this.get(
      "/google",
      ["NO_AUTH"],
      passportCall("google", {
        scope: ["profile", "email"],
        strategyType: "OAUTH",
      }),
      async (req, res) => {}
    );

    this.get(
      "/googlecallback",
      ["NO_AUTH"],
      passportCall("google", { strategyType: "OAUTH" }),
      async (req, res) => {
        const tokenizedUser = {
          name: `${req.user.firstName} ${req.user.lastName}`,
          id: req.user._id,
          role: req.user.role,
          cart: req.user.cart,
        };
        const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
          expiresIn: "1d",
        });
        res.cookie(config.jwt.COOKIE, token);
        res.clearCookie("cart");
        res.sendSuccess("Logged In");
        console.log(req.user);

   
      });

    this.get("/current", ["AUTH"], async (req, res) => {
      res.sendSuccessWithPayload(req.user);
    });
  }
}

const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();

