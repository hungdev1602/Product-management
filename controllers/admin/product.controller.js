const Product = require('../../models/product.model')
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  }

  // Lọc theo trạng thái (hoạt động, dừng hoạt động)
  if(req.query.status){
    find.status = req.query.status
  }
  // Hết Lọc theo trạng thái (hoạt động, dừng hoạt động)

  // Tìm kiếm sản phẩm
  if(req.query.keyword){
    const regex = new RegExp(req.query.keyword, "i")
    find.title = regex
  }
  // Hết tìm kiếm sản phẩm

  const products = await Product.find(find)

  res.render("admin/pages/product/index.pug", {
    pageTitle: "Danh sach san pham",
    products: products
  })
}
