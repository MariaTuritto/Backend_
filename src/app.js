import express from 'express';
import mogoose from 'mongoose';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import sessionRouter from './routes/sessions.routes.js';

// import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';




const app = express();

const PORT = process.env.PORT||8080;

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
//connect whit moongoose:
const connection = mogoose.connect("mongodb+srv://turittomaria:1234@cluster0.5r7jrt7.mongodb.net/Myecommerce?retryWrites=true&w=majority")



app.engine('handlebars', handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));
app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://turittomaria:1234@cluster0.5r7jrt7.mongodb.net/Myecommerce?retryWrites=true&w=majority",
        ttl:500
    }),
    resave:false,
    saveUninitialized: false,
    secret:'myEcommerce'
}));

//routes 
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter)





