const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true },
    image: { 
      public_id:{
        type:String,
        required:true,
      },
      url:{
        type:String,
        required:true
      }
    },
    sizes: { type: Array, required: true },
    colors: { type: Array },
    quantity: { type: Number, default: 1 },
    qty: { type: Number, default: 1 },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
