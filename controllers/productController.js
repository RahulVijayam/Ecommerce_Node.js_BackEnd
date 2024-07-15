const Product = require('../models/Product')
const Firm = require('../models/Firm')
const multer=require('multer')
const path=require('path');


/*Image Code*/
const storage = multer.diskStorage({
    destination:function(req,file,  cb){
        cb(null,'uploads/');//Destination folder where the uploaded images will be stored
    },
    filename: function(req,file,cb){
        cb(null,Date.now() + path.extname(file.originalname)); // Generating a Unique FileName
    }
});
const upload = multer({storage:storage})


//Add Product Code

const addProduct = async(req,res)=>{
    try {
        const{productName, price,category,bestSeller,description} = req.body;
        const image = req.file?req.file.filename:undefined;

        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"Firm Not Found in DB"})
        }

        const createProduct = new Product({
            productName, price,category,image,bestSeller,description,firm:firm._id
        })
        const savedProduct = await createProduct.save();

        firm.products.push(savedProduct); // products this referance u can get it from Firm Model 

        await firm.save();
        
        return res.status(201).json({success:"Product Succesfully Added to Firm"});
       // return res.status(200).json(savedProduct);

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:"Internal Server Error"})
    }
};



//Get Products By Firm Id
const getProductByFirm = async(req,res)=>{
   
    try {
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({error:"Firm Not Found in DB"})
        }
        const restaurantName = firm.firmName;
        const products = await Product.find({firm:firmId});
        
        return res.status(200).json({restaurantName,products});

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:"Internal Server Error"})
    }
}

//Delete Product By Id
const deleteProductById = async(req, res)=>{
    try {
        const productId = req.params.pid;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({error:"Product Not Found in DB"})
        }
        
            
        return res.status(200).json({success:"Product Deleted Successfully"});

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:"Internal Server Error"})
    }
}


module.exports = {addProduct:[upload.single('image'),addProduct], getProductByFirm, deleteProductById};