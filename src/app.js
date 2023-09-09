import express from 'express';
import mogoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import viewsRoutes from './routes/views.routes.js';
import productManager from './dao/mongo/managers/productManager.js';
import chatManager from './dao/mongo/managers/chatManager.js';


const app = express();

const PORT = process.env.PORT||8080;
//Lintening server:
const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
//connect whit moongoose:
const connection = mogoose.connect("mongodb+srv://turittomaria:1234@cluster0.5r7jrt7.mongodb.net/ecommerce?retryWrites=true&w=majority")

app.engine('handlebars', handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

//routes 
app.use('api/products', productsRouter);
app.use('api/carts', cartsRouter);
app.use('/', viewsRoutes);

//connect socket:
const io = new Server(server);

const prodManager = new productManager();
const cManager = new chatManager();

io.on('connection', async (socket) => {
    console.log(`Client connected: ${socket}`)

    const listProducts = await prodManager.getProducts();
    server.emit('sendProducts', listProducts);

    io.on('addProduct', async (obj) => {
        await prodManager.addProducts(obj);
        const listProducts = await prodManager.getProducts({});
        io.emit ('sendProducts', listProducts);
    });

    io.on('deleteProduct', async (id)=> {
        await prodManager.deleteProduct(id);
        const listProducts = await prodManager.getProducts({});
        server.emit('sendProducts', listProducts);
    });

    io.on('newUser', (user) => {
        console.log('user', user);
        io.broadcast.emit('broadcast', user);
    });
    io.on("disconnect", () => {
        console.log(`User with ID : ${socket.id} is disconnected`);
      });

    io.on('message', async (info) => {
        console.log(info)
        await cManager.createMessage(info);
        server.emit('chat', await cManager.getMessages());
    });

    io.on ('disconnect', ()=>{
        console.log('disconnected client')
    });

});







