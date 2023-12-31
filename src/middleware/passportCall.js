import passport from "passport";

const passportCall = (strategy, options = {}) => {
  return (req, res, next) => {
    passport.authenticate(strategy, options, async (error, user, info) => {
      if (error) {
        return next(error);
      }
      if (!options.strategyType) {
        return res
          .status(500)
          .send("Internal Server Error: strategyType not defined");
      }
      if (!user) {
        handleUnauthenticatedUser(req, res, next, options.strategyType, info);
      } else {
        req.user = user;
        next();
      }
    })(req, res, next);
  };
};

const handleUnauthenticatedUser = (req, res, next, strategyType, info) => {
  switch (strategyType) {
    case "LOCALS":
      return res.status(401).send({
        status: "error",
        error: info.message ? info.message : info.toString(),
      });
    case "JWT":
      req.user = null;
      next();
      break;
    case "GOOGLE":
      req.user = null;
      next();
      break;
    case "OAUTH":
      req.user = null;
      next();
      break;
    default:
      return res
        .status(500)
        .send("Internal Server Error: Invalid strategyType");
  }
};

export default passportCall;















      // switch(options.strategyType){
        //     case 'LOCALS':{
        //         return res.status(401).send({status:"error",error:info.message?info.message:info.toString()})
        //     }
        //     case 'JWT': {
        //         req.user = null;
        //         return next();
        //     }
        //     case 'GOOGLE': {
        //         return res.status(401).send({status: "error", error: info.message ? info.message : info.toString()})
        //     }
        // }