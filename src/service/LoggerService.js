import winston from "winston";

export default class LoggerService {
  constructor(env) {
    this.options = {
      levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
      }
    
    }; 
    this.logger = this.createLogger(env);
  }

  createLogger = (env) => {
    switch (env) {
      case "development":
        return winston.createLogger({
          levels: this.options.levels,
          transports: [
            new winston.transports.Console({ level: "debug" })
          ],
        }); 

      case "production":
        return winston.createLogger({
          levels: this.options.levels,
          transports: [
            new winston.transports.Console({ level: "info" }),
            new winston.transports.File({
              filename: "./activityErrors.log",
              level: "error",
            }),
          ],
        });
    }
  };
}