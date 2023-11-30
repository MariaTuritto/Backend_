import jwt from "jsonwebtoken"
import __dirname from "../utils.js";
import ErrorsDictionary from "../dictionary/errors.js";
import errorCodes from "../dictionary/errorCodes.js";
import MailerService from "../service/MailerService.js"
import { userService } from "../service/index.js";
import authService  from "../service/authService.js";
import config from "../config/config.js";
import DMailTemplates from "../constants/DMailTemplates.js";

const register = async (req, res) => {
  try {
    const mailerService = new MailerService();
    const result = await mailerService.sendMail(
      [req.user.email],
      DMailTemplates.WELCOME,
      { user: req.user }
    );
  } catch (error) {
    const customError = new Error();
    const knownError = ErrorsDictionary[error.name];

    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes[knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);
    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }
  res.clearCookie("cart");
  return res.sendSuccess("Registered");
};

const login = async (req, res) => {
  const tokenizedUser = {
    name: `${req.user.firstName} ${req.user.lastName}`,
    id: req.user._id,
    role: req.user.role,
    cart: req.user.cart,
    email: req.user.email,
  };
  const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
    expiresIn: "1d",
  });
  res.cookie(config.jwt.COOKIE, token);
  res.clearCookie("cart");
  return res.sendSuccess("Logged In");
};

const logout = async (req, res) => {
  res.clearCookie(config.jwt.COOKIE);
  return res.sendSuccess("Logged Out");
};

const current = async (req, res) => {
  return res.sendSuccessWithPayload(req.user);
};


const applyGoogleCallback = async (req, res) => {
  try {
    const { firstName, lastName, _id, role, cart, email } = req.user;
    const tokenizedUser = {
      name: `${firstName} ${lastName}`,
      id: _id,
      role: role,
      cart: cart,
      email: email,
    };
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, {
      expiresIn: "1d",
    });
    res.cookie(config.jwt.COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 86400000,
    });
    res.clearCookie("cart");
    return res.redirect("/profile");
  } catch (error) {
    console.error("Error in Google callback:", error);
    return res.sendError("An error occurred during login");
  }
};

const mailing = async (req, res) => {
  try {
    //GENERAMOS EL MAIL DE BIENVENIDA
    const mailService = new MailerService();
    const result = await mailService.sendMail(
      [req.user.email],
      DMailTemplates.WELCOME,
      { user: req.user }
    );
  } catch (error) {
    const customError = new Error();
    const knownError = ErrorsDictionary[error.name];

    if (knownError) {
      customError.name = knownError;
      customError.message = error.message;
      customError.code = errorCodes[knownError];
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(customError);
    } else {
      req.logger.error(`[${new Date().toISOString()}] Error: ${error.message}`);
      next(error);
    }
  }
};

const loginJWT = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .send({ status: "error", error: "Incomplete values" });
  const user = await userService.getUserBy({ email });
  if (!user)
    return res
      .status(400)
      .send({ status: "error", error: "Incorrect Credentials" });
  const isValidPassword = await authService.validatePassword(
    password,
    user.password
  );
  if (!isValidPassword)
    return res
      .status(400)
      .send({ status: "error", error: "Invalid Credentials" });
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.firstName,
    },
    config.jwt.SECRET,
    {
      expiresIn: "1d",
    }
  );
  res.cookie(config.jwt.COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 86400000,
  });
  return res.sendSuccess("Logged In", token);
};

const passwordRestoreRequest = async (req, res) => {
  const { email } = req.body;
  const user = await userService.getUserBy({ email });
  if (!user) return res.sendBadRequest("User doesn't exist ");
  const MailerService = new MailerService();
  const result = await MailerService.sendMail(
    [email],
    DMailTemplates.PWD_RESTORE,
    {}
  );

  res.sendSuccess("Email sent");
};

const restorePassword = async (req, res) => {
  const { newPassword, token } = req.body;
  if (!newPassword || !token) return res.sendBadRequest("Incomplete values");
  try {
    //El token es válido?
    const { email } = jwt.verify(token, config.jwt.SECRET);
    //El usuario está en la base?
    const user = await userService.getUserBy({ email });
    if (!user) return res.sendBadRequest("User doesn't exist");
    //¿No será la misma contraseña que ya tiene?
    const isSamePassword = await authService.validatePassword(
      newPassword,
      user.password
    );
    if (isSamePassword)
      return res.sendBadRequest("New Password Cannot be equal to Old Password");
    //Hashear mi nuevo password
    const hashNewPassword = await authService.createHash(newPassword);
    await userService.updateUser(user._id, { password: hashNewPassword });
    res.sendSuccess();
  } catch (error) {
    console.log(error);
    res.sendBadRequest("Invalid token");
  }
};


export default {
  register,
  login,
  logout,
  current,
  applyGoogleCallback,
  mailing,
  loginJWT,
  passwordRestoreRequest,
  restorePassword,
};