import express from 'express';
import mogoose from 'mongoose';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import passport from 'passport';



import viewsRouter from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import SessionsRouter from './routes/SessionsRouter.js';



import cartSetter from './middleware/cartSetter.js';

import __dirname from './utils.js';
import config from './config/config.js';
import initializeStrategies from './config/passport.config.js'; 

const app = express();

const PORT = config.app.PORT;

const server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

//connect whit moongoose:
const connection = mogoose.connect(config.mongo.URL)

app.engine('handlebars', handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');



//Middlewares
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cartSetter);


//inicializamos passport:
initializeStrategies();
app.use(passport.initialize());


//routes 
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('api/sessions', SessionsRouter);


