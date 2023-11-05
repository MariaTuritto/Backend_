import express from 'express';
import { Server } from "socket.io";
import mogoose from 'mongoose';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import cors from 'cors';




import viewsRouter from './routes/ViewsRouter.js';
import productsRouter from './routes/ProductsRouter.js';
import cartsRouter from './routes/CartRouter.js';
import SessionsRouter from './routes/SessionsRouter.js';





import __dirname from './utils.js';
import config from './config/config.js';
import initializeStrategies from './config/passport.config.js'; 

import ChatDao from './dao/mongo/managers/chatDao.js';


const app = express();

const PORT = config.app.PORT;

const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
//connect whit moongoose:
const connection = mogoose.connect(config.mongo.URL)

app.engine('handlebars', handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

//Middlewares
app.use(cors({origin:['http://localhost:8080'],credentials:true}));
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());



//inicializamos passport:
initializeStrategies();



//routes 
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', SessionsRouter);





//ADD CHAT SOCKET.IO
const chatDao = new ChatDao();
const io = new Server(server);

io.on("connection", async (socket) => {
    console.log("Cliente conectado con id: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
      });

      socket.on("newUser", (user) => {
        console.log("usuario", user);
        socket.broadcast.emit("broadcast", usuario);
      });

      socket.on("disconnect", () => {
        console.log(`Usuario con ID : ${socket.id} esta desconectado `);
      });
    
      socket.on("message", async (info) => {
        console.log(info);
        await chatDao.createMessage(info);
       io.emit("chat", await chatDao.getMessages());
      })


});


