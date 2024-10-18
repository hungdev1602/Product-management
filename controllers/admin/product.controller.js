const Product = require('../../models/product.model')
const ProductCategory = require("../../models/product-category.model")
const systemConfig = require('../../config/system')
const Account = require('../../models/account.model')
const moment = require("moment")
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

  // Sắp xếp
  const sort = {}

  if(req.query.sortKey && req.query.sortValue){
    sort[req.query.sortKey] = req.query.sortValue
  }
  else{
    sort["position"] = "desc"
  }
  // HếtSắp xếp

  const products = await Product
    .find(find)
    .limit(limitItem)
    .skip(skip)
    .sort(sort)

  // Log ai tạo ra và thời gian tạo ra
  for (const item of products) {
    const infoCreated = await Account.findOne({
      _id: item.createdBy
    })

    // tạo bởi
    if(infoCreated){
      item.createdByFullName = infoCreated.fullName
    }
    else{
      item.createdByFullName = ""
    }

    if(item.createdAt){
      item.createdAtFormat = moment(item.createdAt).format("HH:mm:ss DD/MM/YY")
    }

    // Cập nhật bởi
    const infoUpdated = await Account.findOne({
      _id: item.updatedBy
    })

    if(infoUpdated){
      item.updatedByFullName = infoUpdated.fullName
    }
    else{
      item.createdByFullName = ""
    }

    if(item.updatedAt){
      item.updatedAtFormat = moment(item.createdAt).format("HH:mm:ss DD/MM/YY")
    }
  }

  res.render("admin/pages/product/index.pug", {
    pageTitle: "Danh sach san pham",
    products: products,
    totalPage: totalPage,
    currentPage: page,
    limitItem: limitItem
  })
}
// Trang thùng rác
module.exports.trash = async (req, res) => {
  const find = {
    deleted: true
  }

  const products = await Product.find(find)

  for (const item of products) {
    const deletedUser = await Account.findOne({
      _id: item.deletedBy
    })

    if(deletedUser){
      item.deletedByFullName = deletedUser.fullName
    }

    if(item.deletedAt){
      item.deletedAtFormat = moment(item.deletedAt).format("HH:mm:ss DD/MM/YYYY")
    }
  }

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
    status: req.body.status,
    updatedBy: res.locals.user._id,
    updatedAt: new Date()
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
        status: req.body.status,
        updatedBy: res.locals.user._id,
        updatedAt: new Date()
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
        deleted: true,
        deletedBy: res.locals.user._id,
        deletedAt: new Date()
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
    deleted: true,
    deletedBy: res.locals.user._id,
    deletedAt: new Date()
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
    position: req.body.position,
    updatedBy: res.locals.user._id,
    updatedAt: new Date()
  })

  req.flash("success", "Đổi vị trí thành công")

  res.json({
    code: "success"
  })
}

module.exports.create = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false
  })

  res.render("admin/pages/product/create.pug", {
    pageTitle: "Trang thêm mới sản phẩm",
    listCategory: listCategory
  })
}

module.exports.createPost = async (req, res) => {
  if(res.locals.role.permissions.includes("products_create")){
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    // thêm log người tạo và thời gian tạo
    req.body.createdBy = res.locals.user._id
    req.body.createdAt = new Date()

    if(req.body.position){
      req.body.position = parseInt(req.body.position)
    }
    else{
      const countRecord = await Product.countDocuments()
      req.body.position = countRecord + 1;
    }

    // if(req.file){
    //   req.body.thumbnail = `/uploads/${req.file.filename}`
    // }

    // lưu vào DB
    const record = new Product(req.body);
    await record.save();
  }
  else{
    req.flash("error", "Không có quyền truy cập")
  }

  res.redirect(`/${systemConfig.prefixAdmin}/products`)
}

module.exports.edit = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false
  })

  const id = req.params.id;
  
  const product = await Product.findOne({
    _id: id,
    deleted: false
  })

  res.render("admin/pages/product/edit.pug", {
    pageTitle: "Trang chỉnh sửa sản phẩm",
    product: product,
    listCategory: listCategory
  })
}

module.exports.editPatch = async (req, res) => {
  if(res.locals.role.permissions.includes("products_edit")){
    const id = req.params.id

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    // Lưu log lịch sử sửa đổi 1 product
    req.body.updatedBy = res.locals.user._id
    req.body.updatedAt = new Date()

    if(req.body.position){
      req.body.position = parseInt(req.body.position)
    }

    // if(req.file){
    //   req.body.thumbnail = `/uploads/${req.file.filename}`
    // }

    await Product.updateOne({
      _id: id,
      deleted: false
    }, req.body)

    req.flash("success", "Cập nhật thành công")
  }
  else{
    req.flash("error", "Không có quyền truy cập")
  }
  
  res.redirect("back")
}

module.exports.detail = async (req, res) => {
  const id = req.params.id;
  
  const product = await Product.findOne({
    _id: id,
    deleted: false
  })

  res.render("admin/pages/product/detail.pug", {
    pageTitle: "Trang chi tiết sản phẩm",
    product: product
  })
}