const Role = require("../../models/role.model")
const systemConfig = require('../../config/system')
module.exports.index = async (req, res) => {
  const records = await Role.find({
    deleted: false
  })

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records
  })
}

module.exports.create = async (req, res) => {

  res.render("admin/pages/roles/create.pug", {
    pageTitle: "Tạo nhóm quyền"
  })
}

module.exports.createPost = async (req, res) => {
  if(res.locals.role.permissions.includes("roles_create")){
    const role = new Role(req.body);
    await role.save();
  }
  
  res.redirect(`/${systemConfig.prefixAdmin}/roles`)
}

module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const roles = await Role.findOne({
    _id: id,
    deleted: false
  })

  res.render("admin/pages/roles/edit", {
    pageTitle: "Chỉnh sửa nhóm quyền",
    roles: roles
  })
}

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  if(res.locals.role.permissions.includes("roles_edit")){
    await Role.updateOne({
      _id: id,
      deleted: false
    }, req.body)
  
    req.flash("success", "Cập nhật thành công")
  }
  res.redirect(`back`);
}

module.exports.permissions = async (req, res) => {
  const records = await Role.find({
    deleted: false
  })
  
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records
  })
}

module.exports.permissionsPatch = async (req, res) => {
  for (const item of req.body) {
    await Role.updateOne({
      _id: item.id,
      deleted: false
    }, {
      permissions: item.permissions
    })
  }

  req.flash("success", "Cập nhật thành công")

  res.json({
    code: "success"
  })
}

module.exports.detail = async (req, res) => {
  const id = req.params.id
  const role = await Role.findOne({
    _id: id
  })

  res.render("admin/pages/roles/detail.pug", {
    pageTitle: "Chi tiết nhóm quyền",
    role: role
  })
}

module.exports.delete = async (req, res) => {
  await Role.deleteOne({
    _id: req.body.id
  })

  res.json({
    code: 200
  })
}