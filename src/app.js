import express from 'express';
import mogoose from 'mongoose';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRoutes from './routes/views.routes.js';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';




const app = express();

const PORT = process.env.PORT||8080;

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
//connect whit moongoose:
const connection = mogoose.connect("mongodb+srv://turittomaria:1234@cluster0.5r7jrt7.mongodb.net/Myecommerce?retryWrites=true&w=majority")


app.engine('handlebars', handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

//routes 
app.use('/', viewsRoutes);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);





