import passport from "passport";

const passportCall = (strategy,options={}) => {
    return (req, res, next) => {
        passport.authenticate(strategy,options, async(error, user, info) => {
            if(error) return next(error);
            if(!options.strategyType){
                return res.sendInternalError('strategyType not defined')
            }
            if(!user) {
                 //La próxima vez que no encuentre al usuario, el tipo de estrategia me va a ayudar a definir
                //cómo deberia reaccionar.
                switch(options.strategyType){
                    case 'LOCALS':{
                        return res.status(401).send({status:"error",error:info.message?info.message:info.toString()})
                    }
                    case 'JWT': {
                        req.user = null;
                        return next();
                    }
                    case 'GOOGLE': {
                        return res.status(401).send({status: "error", error: info.message ? info.message : info.toString()})
                    }
                }
            }
            req.user = user;
            next();
        })(req,res, next);
    }
}

export default passportCall;