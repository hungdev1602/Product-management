const ProductCategory = require("../../models/product-category.model")
const systemConfig = require('../../config/system')

module.exports.index = async (req, res) => {
  const listCategory = await ProductCategory
    .find({
      deleted: false
    })
    .sort({
      position: "desc"
    })

  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Danh sách danh mục sản phẩm",
    listCategory: listCategory
  })
}

module.exports.create = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false
  })

  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
    listCategory: listCategory
  })
}

module.exports.createPost = async (req, res) => {

  if(req.body.position){
    req.body.position = parseInt(req.body.position)
  }
  else{
    const countRecord = await ProductCategory.countDocuments();
    req.body.position = countRecord + 1;
  }

  if(res.locals.role.permissions.includes("products_category_create")){
    const record = new ProductCategory(req.body);
    await record.save();
  }
  

  res.redirect(`/${systemConfig.prefixAdmin}/products-category`)
}

module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const listCategory = await ProductCategory.find({
    deleted: false
  })

  const currentCategory = await ProductCategory.findOne({
    _id: id,
    deleted: false
  })

  res.render("admin/pages/products-category/edit.pug", {
    pageTitle: "Chỉnh sửa danh mục sản phẩm",
    listCategory: listCategory,
    currentCategory: currentCategory
  })
}

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  if(req.body.position){
    req.body.position = parseInt(req.body.position)
  }
  else{
    delete req.body.position;
  }

  if(res.locals.role.permissions.includes("products-category_edit")){
    await ProductCategory.updateOne({
      _id: id,
      deleted: false
    }, req.body)

    req.flash("success", "Cập nhật thành công")
    console.log("ok")
  }
  
  res.redirect(`back`)
}

module.exports.changeStatus = async (req, res) => {
  await ProductCategory.updateOne({
    _id: req.body.id
  }, {
    status: req.body.status
  })

  req.flash("success", "Thay đổi trạng thái thành công")

  res.json({
    code: 200
  })
}

module.exports.changePosition = async (req, res) => {
  await ProductCategory.updateOne({
    _id: req.body.id
  }, {
    position: req.body.position
  })

  req.flash("success", "Thay đổi vị trí thành công")

  res.json({
    code: 200
  })
}

module.exports.trash = async (req, res) => {
  const allCategory = await ProductCategory.find({
    deleted: true
  })

  res.render("admin/pages/products-category/trash.pug", {
    pageTitle: "Trang thùng rác",
    allCategory: allCategory
  })
}

module.exports.delete = async (req, res) => {
  await ProductCategory.updateOne({
    _id: req.body.id
  }, {
    deleted: true
  })

  req.flash("success", "Xoá thành công")

  res.json({
    code: 200
  })
}

module.exports.restore = async (req, res) => {
  await ProductCategory.updateOne({
    _id: req.body.id
  }, {
    deleted: false
  })

  req.flash("success", "Khôi phục thành công")

  res.json({
    code: 200
  })
}

module.exports.permanentlyDelete = async (req, res) => {
  await ProductCategory.deleteOne({
    _id: req.body.id
  })

  req.flash("success", "Xoá vĩnh viễn thành công")

  res.json({
    code: 200
  })
}

module.exports.detail = async (req, res) => {

  const category = await ProductCategory.findOne({
    _id: req.params.id,
    deleted: false
  })

  res.render("admin/pages/products-category/detail.pug", {
    pageTitle: "Chi tiết sản phẩm",
    category: category
  })
}