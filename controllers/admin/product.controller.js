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

  // Phân trang
  let limitItem = 4;
  let page = 1;

  if(req.query.limit){
    limitItem = parseInt(req.query.limit)
  }

  if(req.query.page){
    page = parseInt(req.query.page)
  }
  const skip = (page - 1) * limitItem; // bỏ qua bao nhiêu phần tử, để bắt đầu lấy phần tử của trang đó

  // trả về cho FE cần vẽ bao nhiêu trang
  const totalProduct = await Product.countDocuments(find) // đếm tổng sản phẩm trong db
  const totalPage = Math.ceil(totalProduct / limitItem) //đếm tổng cần bao nhiêu trang
  // Hết Phân trang

  const products = await Product.find(find).limit(limitItem).skip(skip)

  res.render("admin/pages/product/index.pug", {
    pageTitle: "Danh sach san pham",
    products: products,
    totalPage: totalPage,
    currentPage: page
  })
}

module.exports.changeStatus = async (req, res) => {

  await Product.updateOne({
    _id: req.body.id
  }, {
    status: req.body.status
  })

  res.json({
    code: "success",
    message: "đổi trạng thái thành công"
  })
}