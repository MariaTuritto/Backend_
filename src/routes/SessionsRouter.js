import BaseRouter from "./BaseRouter.js";
import sessionsController from "../controllers/sessions.controller.js";
import passportCall from "../middleware/passportCall.js";
import { validateJWT } from "../middleware/jwtExtractor.js";
import authService from "../service/authService.js";

// import config from "../config/config.js";
// import MailingService from "../service/mailingService.js";

class SessionsRouter extends BaseRouter {
  init() {
    this.post(
      "/register",
      ["NO_AUTH"],
      passportCall("register", { strategyType: "LOCALS" },   sessionsController.register),
    );
    this.post(
      "/login",
      ["NO_AUTH"],
      passportCall("login", { strategyType: "LOCALS" }, sessionsController.login),
   );
    
    this.get(
      "/google",
      ["NO_AUTH"],
      passportCall("google", {
        scope: ["profile", "email"],
        strategyType: "GOOGLE",
      }),
      async (req, res) => {}
    );

    this.get(
      "/googlecallback",
      ["NO_AUTH"],
      passportCall("google", { strategyType: "OAUTH" }, sessionsController.applyGoogleCallback),
      );

      this.get("/logout", ["AUTH"], sessionsController.logout);

      this.get("/current", ["AUTH"], sessionsController.current);

  
      this.get("authFail", async (req,res) => {
        req.logger.error(`[${new Date().toISOString()}] Error: user authentication failure `);
        res.status(401).send({ status: "error" });
      });

      this.get("/mails", ["AUTH"], sessionsController.mailing);

  
      this.post(
        "/passwordRestoreRequest",
        ["PUBLIC"],
        sessionsController.passwordRestoreRequest
      );
      this.put(
        "/password-restore",
        ["PUBLIC"],
        sessionsController.restorePassword
      );

  }
}



const sessionsRouter = new SessionsRouter();

export default sessionsRouter.getRouter();

