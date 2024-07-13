const Firm = require('../models/Firm')
const Vendor = require('../models/Vendor')
const multer=require('multer')


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


/*Adding Firm Code*/
const addFirm  = async(req,res)=>{
 try{
    const {firmName,area,category,region,offer} = req.body
    const image = req.file?req.file.filename:undefined;
    const vendor = await Vendor.findById(req.vendorId)

    if(!vendor)
    {
        return res.status(404).json({success:"Vendor Not Found"})
    }

    const newfirm  = new Firm({
        firmName,area,category,region,offer,image,vendor:vendor._id
    })

    const savedFirm = await newfirm.save();

    vendor.firm.push(savedFirm)
    await vendor.save(); 
    return res.status(200).json({success:"Firm Added Succesfully"})
 }
 catch(error){
    console.log(error)
    return res.status(500).json({success:"Internal Server Error"})
 }
  
}



//Delete Firm By Id
const deleteFirmById = async(req, res)=>{
    try {
        const firmId = req.params.fid;
        const deletedFirm = await Firm.findByIdAndDelete(firmId);
        if(!deletedFirm){
            return res.status(404).json({error:"Firm Not Found in DB"})
        }
        
            
        return res.status(200).json({success:"Firm Deleted Successfully"});

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:"Internal Server Error"})
    }
}


module.exports = {addFirm:[upload.single('image'),addFirm,], deleteFirmById}         // We Can export like this when image is involved 