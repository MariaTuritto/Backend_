import express from 'express';
import { Server } from "socket.io";
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'express-compression';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";


import viewsRouter from './routes/ViewsRouter.js';
import productsRouter from './routes/ProductsRouter.js';
import cartsRouter from './routes/CartRouter.js';
import SessionsRouter from './routes/SessionsRouter.js';
import dictionaryRouter from './routes/DictionaryRouter.js';



import __dirname from './utils.js';
import config from './config/config.js';
import initializeStrategies from './config/passport.config.js';
import ErrorHandler from './middleware/errorHandler.js';
import attachLogger from './middleware/attachLogger.js';

import { chatService } from './service/index.js';




const app = express();

const PORT = config.app.PORT;

const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));


//connect whit moogoose:
const connection = mongoose.connect(config.mongo.URL)


app.engine('handlebars', handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

//Middlewares
app.use(cors({origin:['http://localhost:8080'],credentials:true}));
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(attachLogger);


//inicializamos passport:
initializeStrategies();


//routes 
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', SessionsRouter);
app.use("/api/dictionary", dictionaryRouter);


//COMPRESSION WITH BROTOLI 
app.use(compression({
    brotli: {
      enabled: true,
      zlib: {},
    },
  })
);
//LOGGER
app.use("/loggerTest", (req, res) => {

  req.logger.http("ERROR HTTP");
  req.logger.info("ERROR INFO");
  req.logger.error("ERROR ERROR");
  req.logger.fatal("FATAL ERROR");
  res.sendStatus(200);
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SuperChevere docs",
      version: "1.0.0",
      description: "Aplicación para E-commerce de productos importados y Nacionales",
    },
  },
  apis: [`${__dirname}/docs/**/*.yml`],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use(
  "/apidocs",
  swaggerUIExpress.serve,
  swaggerUIExpress.setup(swaggerSpec)
);

app.use((error, req, res, next) => {
  ErrorHandler(error, req, res, next);
  res.status(500).send({
    status: "error",
    message: "Error interno del servidor",
  });
});



//CHAT SOCKET.IO

const io = new Server(server);

io.on("connection", async (socket) => {
    console.log("Cliente conectado con id: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
      });

      socket.on("newUser", (user) => {
        socket.broadcast.emit("broadcast", user);
      });

      socket.on("disconnect", () => {
        console.log(`Usuario con ID : ${socket.id} esta desconectado `);
      });
    
      socket.on("message", async (info) => {
        console.log(info);
        await chatService.createMessage(info);
       io.emit("chat", await chatService.getMessages());
      })


});


