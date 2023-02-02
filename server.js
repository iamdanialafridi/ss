const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');
const cors = require('cors')
const app =  express();
//database mondb connection
async function init_Database(){
try {
    mongoose.set('strictQuery', false);
await mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('connect With Database: successfully')
})
} catch(error){
    console.log('MongoDb-Connection Error\t\t',error);
    throw error;
}
}
// initiate db
init_Database();

// create scheme for db
const product_scheme = {
    title :String,
    item_type :String,
    description :String,
    category :String,
    image : String,
    price : Number,
    rating: {
        rate: Number,
        count:  Number
      }
}

const productModel = mongoose.model("products",product_scheme);
async function fetch_All_Products(req,res) {
    try {
        // local variable holding product array from db
        const product = await productModel.find().exec();
        if(product){
            res.status(200).send(product);
        } else {
            res.status(400).send('No Product Found');
        }

    } catch (error) {
        console.log('Fetch-Product Db-Error',error);
        throw error;
    }
    
}


async function getProductById (req,res) {
    try {
        const productId = req.params['id'];
       const productByID = await productModel.findById(productId).exec();
       if (productByID) {
        res.status(200).send(productByID);
       } else {
          res.status(400).send('No Product Found By ID,'+productId);
       }
        
    } catch (error) {
                console.log('get-product-by-id error',error);

        throw error;
    }
}


//midleware cors
app.use(cors())



app.get("/products",fetch_All_Products);
app.get("/products/:id",getProductById);
app.listen(4000,()=>{console.log('Server Started at port 4000')})