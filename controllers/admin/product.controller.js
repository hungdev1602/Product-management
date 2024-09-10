const Product = require('../../models/product.model')
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }

  if(req.query.status){
    find.status = req.query.status
  }

  const products = await Product.find(find)

  res.render("admin/pages/product/index.pug", {
    pageTitle: "Danh sach san pham",
    products: products
  })
}
