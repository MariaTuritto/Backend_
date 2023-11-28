import LoggerService from "../service/LoggerService.js";
import config from "../config/config.js";

const logger = new LoggerService(config.app.ENV);

const attachLogger = (req,res,next)=>{
    req.logger = logger.logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next();
}

export default attachLogger;