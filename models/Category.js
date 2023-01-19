const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    desc:{type:String,required:true},
    products:{type:Array,required:true},
},{timestamps:true})

module.exports = mongoose.model("category",categorySchema);