const Vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()
const  secretKey = process.env.key;
const verifyToken = async(req,res,next)=>{
    const token = req.headers.token;

    if(!token){
        return res.status(401).json({error :"Token is required"})
    }
    try {
        const decoded = jwt.verify(token,secretKey)      // this will decode our token which consists of {vendorId:vendor._id}
        const vendor = await Vendor.findById(decoded.vendorId); 
        if(!vendor)
        {
            return res.status(404).json({error:"Vendor Not Found"})
        }

        req.vendorId = vendor._id;

        next()
    }
    catch(error){

        console.log(error)
        return res.status(500).json({error:"Invalid Token"})
        
    }
}

module.exports = verifyToken;