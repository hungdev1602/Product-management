const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
  // Sản phẩm nổi bật
  const productFeatured = await Product
    .find({
      deleted: false,
      status: "active",
      featured: "1"
    })
    .sort({
      position: "desc"
    })
    .limit(6)

  
  for (const item of productFeatured) {
    item.priceNew = (1 - item.discountPercentage / 100) * item.price
    item.priceNew = item.priceNew.toFixed(0)
  }

  // Sản phẩm mới
  const productsNew = await Product
    .find({
      deleted: false,
      status: "active"
    })
    .sort({
      position: "desc"
    })
    .limit(6)

  
  for (const item of productsNew) {
    item.priceNew = (1 - item.discountPercentage / 100) * item.price
    item.priceNew = item.priceNew.toFixed(0)
  }

  // Sản phẩm giảm giá nhiều
  const productsDiscount = await Product
    .find({
      deleted: false,
      status: "active"
    })
    .sort({
      discountPercentage: "desc"
    })
    .limit(6)

  
  for (const item of productsDiscount) {
    item.priceNew = (1 - item.discountPercentage / 100) * item.price
    item.priceNew = item.priceNew.toFixed(0)
  }

  // Lấy ra các sản phẩm cụ thể (lấy theo id)
  const productsChoose = await Product
    .find({
      _id: { $in: [
        "66e9f560c1f878f8776d00d4", 
        "66e896285f343b6c83347266"
      ]}, //lấy ra các phần tử có id bên trong mảng
      deleted: false,
      status: "active"
    })
    .sort({
      position: "desc"
    })

  
  for (const item of productsChoose) {
    item.priceNew = (1 - item.discountPercentage / 100) * item.price
    item.priceNew = item.priceNew.toFixed(0)
  }

  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chu",
    productFeatured: productFeatured,
    productsNew: productsNew,
    productsDiscount: productsDiscount,
    productsChoose: productsChoose
  })
}
