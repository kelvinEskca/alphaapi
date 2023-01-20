const Product = require("../models/Product");
const router = require("express").Router();
const cloudinary = require('../utils/cloudinary');
const {verifyToken,verifyTokenAuthorization,verifyTokenAdmin} = require("./verifyToken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const saveProduct = async (product) => {
  const newProduct = new Product(product);
  const savedProduct = await newProduct.save();
  console.log(savedProduct);
  return savedProduct;
}

const uploadImages = async (files) => {
  const imagePromises = files.map(async file => {
    return await cloudinary.uploader.upload(file.path, { public_id: file.originalname });
  });
  const imageResults = await Promise.all(imagePromises);
  return imageResults.map(result => result.url);
}

router.post("/", verifyTokenAdmin, upload.array("image", 12), async (req, res) => {
  try {
    const sizesArray = req.body.sizes.split(',').map(size => size.trim());
    const colorsArray = req.body.colors.split(',').map(color => color.trim());
    const imageUrls = await uploadImages(req.files);
    const newProduct = {...req.body, image: imageUrls, sizes: sizesArray, colors: colorsArray};
    const savedProduct = await saveProduct(newProduct);
    res.status(200).json("Product Added");
  } catch (err) {
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
