const Product = require("../models/Product");
const router = require("express").Router();
const cloudinary = require('../utils/cloudinary');
const {verifyToken,verifyTokenAuthorization,verifyTokenAdmin} = require("./verifyToken");
const multer = require('multer');
const storage = multer.diskStorage({
  destination:function(re,file,cb){
    cb(null,'../uploads')
  },
  filename:function(req,file,cb){
    cb(null,Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });
const fs = require('fs');
const { uploader } = require("../utils/cloudinary");

const saveProduct = async (product) => {
  const newProduct = new Product(product);
  const savedProduct = await newProduct.save();
  console.log(savedProduct);
  return savedProduct;
}


router.post("/", verifyTokenAdmin, upload.array("image"), async (req, res) => {
  try {
    const sizesArray = req.body.sizes.split(',').map(size => size.trim());
    const colorsArray = req.body.colors.split(',').map(color => color.trim());
    const uploadImages = async (path) => await cloudinary.uploads(path,"Images");
    if(req.method === 'POST'){
      const urls = [];
      const files = req.files;
      for(const file of files){
        const {path} = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path)
      }
      res.status(200).json({
        data:urls,
        messag:"Image Uploaded Successfully"
      })
    }
    else{
      res.status(405).json({
        err:"Image Upload Failed"
      })
    }
    const newProduct = {...req.body, image: imageUrls, sizes: sizesArray, colors: colorsArray};
    const savedProduct = await saveProduct(newProduct);
    console.log(savedProduct)
    res.status(200).json("Product Added");
  } 
  catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//update product;
router.put("/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//delete product;
router.post("/delete/:id", verifyTokenAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//get all products;
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/female/:id", async (req, res) => {
  try {
    const products = await Product.find({category:req.params.id});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/male/:id", async (req, res) => {
  try {
    const products = await Product.find({category:req.params.id});
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
