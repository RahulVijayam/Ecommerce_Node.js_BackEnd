const Vendor = require('../models/Vendor.js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const dotenv  = require('dotenv');

dotenv.config();


/* Vendor Registration */
const vendorRegister =  async(req,res) => {
    const {username,email,password} = req.body;
    try{
        const vendorEmail = await Vendor.findOne({email}); // This will return vendor details in  json format of  specific user 
        if (vendorEmail)
        {
            //console.log(vendorEmail); 
            console.log("User Already Exists");
            return res.status(400).json({error:"User Already Exist"});
          
        }
        const hashedpassword = await bcrypt.hash(password,10);
        const newVendor=new Vendor({
            username,
            email,
            password : hashedpassword
        });
        await newVendor.save();
        return res.status(201).json({success:"Vendor Registered Successfully"});
        console.log("Registered");
    }catch(error){
        console.log(error);
        return res.status(500).json({error : "Internal Server Error"})
    }

}


/* Vendor Login*/

const vendorLogin = async(req,res)=>{
    const {email,password} = req.body;
    const secretKey = process.env.key;
    try{
        const vendor = await Vendor.findOne({email});
        pass_check=await bcrypt.compare(password,vendor.password);

        if(!vendor || !pass_check) {
            return res.status(401).json({error:"Invalid EmailId or Password"});
        }
        const token = jwt.sign({vendorId:vendor._id},secretKey,{expiresIn :"1h"})
      
     
       const vendorId = vendor._id;
       // console.log(email)
        return res.status(200).json({success:"Login Successful",token,vendorId});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error:"Internal Server Error"});
    }
}
   


/*Get All Vendor Details*/

const getAllVendors = async(req,res)=>{
    try {
        const vendors = await Vendor.find().populate('firm');
        return res.json({vendors})
    } catch (error) {
        console.log(error)
        return res.statu(500).json({error : "Internal Server Error "})
    }
}


//Get Venodor By ID 

const getVendorByID = async(req,res)=>{
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error : "Vendor Not Found"})
        }
        const vendorFirmById=vendor.firm[0]._id;
        res.status(200).json({vendor,vendorFirmById})
    } catch (error) {
        return res.status(500).json({error : "Internal Server Error"})
    }
}
module.exports = {vendorRegister,vendorLogin,getAllVendors,getVendorByID}