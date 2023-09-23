import { Router } from "express";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/authFail",
  }),
  async (req, res) => {
    //Los usuarios siempre van a llegar por req.user
    res.status(200).send({ status: "succes", payload: req.user._id });
  }
);

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/authFail",
    failureMessage: true,
  }),
  async (req, res) => {
    //Los usuarios siempre van a llegar por req.user
    req.session.user = req.user;
    res.send({ status: "succes", message: "Logged In" });
  }
);
//PARA AUTENTICACION DE 3ROS, SIEMPRE OCUPAS 2 ENDPOINTS
//1RO PARA LLAMARLO Y 2DO TE TRAE TODA LA INFO
router.get("/github", passport.authenticate("github"), (req, res) => {});

router.get("/githubcallback", passport.authenticate("github"), (req, res) => {
  req.session.user = req.user;
  res.redirect("/"); //ruta base
});

router.get("/authFail", (req, res) => {
  console.log(req.session.messages);
  res.status(401).send({ status: "error", error: "Error auth" });
});

router.get("/logout", async (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      return res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

export default router;
