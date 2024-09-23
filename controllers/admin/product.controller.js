const Product = require('../../models/product.model')
const systemConfig = require('../../config/system')
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

  const products = await Product
    .find(find)
    .limit(limitItem)
    .skip(skip)
    .sort({
      position: "desc"
    })

  res.render("admin/pages/product/index.pug", {
    pageTitle: "Danh sach san pham",
    products: products,
    totalPage: totalPage,
    currentPage: page
  })
}
// Trang thùng rác
module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  }

  const products = await Product.find(find)
  res.render("admin/pages/product/trash.pug", {
    products: products,
    pageTitle: "Trang thùng rác"
  })
}

module.exports.restore = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    deleted: false
  })

  res.json({
    code: "success",
    message: "Khôi phục thành công"
  })
}

module.exports.deletePermanently = async (req, res) => {
  await Product.deleteOne({
    _id: req.body.id
  })

  res.json({
    code: "success",
    message: "Đã xoá hẳn khỏi DB"
  })
}

module.exports.changeStatus = async (req, res) => {

  await Product.updateOne({
    _id: req.body.id
  }, {
    status: req.body.status
  })

  req.flash('success', 'Đổi trạng thái thành công')

  res.json({
    code: "success",
  })
}

module.exports.changeMulti = async (req, res) => {
  switch(req.body.status){
    case "active":
    case "inactive":
      await Product.updateMany({
        _id: req.body.ids
      }, {
        status: req.body.status
      })
      req.flash('success', 'Đổi trạng thái thành công')
      res.json({
        code: "success"
      })
      break;
    case "delete":
      await Product.updateMany({
        _id: req.body.ids
      }, {
        deleted: true
      })
      req.flash('success', 'Xoá thành công')
      res.json({
        code: "success"
      })
      break;
    default:
      res.json({
        code: "error",
        message: "Trạng thái không hợp lệ"
      })
  }
}

module.exports.delete = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    deleted: true
  })

  res.json({
    code: "success",
    message: "đổi trạng thái thành công"
  })
}

module.exports.changePosition = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    position: req.body.position
  })

  req.flash("success", "Đổi vị trí thành công")

  res.json({
    code: "success"
  })
}

module.exports.create = (req, res) => {
  res.render("admin/pages/product/create.pug", {
    pageTitle: "Trang thêm mới sản phẩm"
  })
}

module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price)
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  if(req.body.position){
    req.body.position = parseInt(req.body.position)
  }
  else{
    const countRecord = await Product.countDocuments()
    req.body.position = countRecord + 1;
  }

  if(req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }

  // lưu vào DB
  const record = new Product(req.body);
  await record.save();

  res.redirect(`/${systemConfig.prefixAdmin}/products`)
}