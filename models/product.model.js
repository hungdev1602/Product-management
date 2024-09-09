const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  { 
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: Boolean
  }
)

const Product = mongoose.model(
  'Product',
  productSchema,
  'products' //tên bộ sưu tập chính xác trong DB, để chọc đúng vào bộ sưu tập đó
);

module.exports = Product