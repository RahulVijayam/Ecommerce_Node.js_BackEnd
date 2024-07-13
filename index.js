const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const bodyParser=require('body-parser');
const productRoutes = require("./routes/productRoutes");
const path = require("path");

const app = express()
const PORT = 4000;

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected Succesfully!"))
.catch((error)=>console.log(error) )


app.listen(PORT,()=>{
    console.log(`Server Started and Running at ${PORT}`)
})

app.use('/home',(req,res)=>{
    res.send("<h1>Welcome to MawaMandi</h1>");
})

app.use(bodyParser.json())
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'))