const Role = require("../../models/role.model")
const Account = require("../../models/account.model")
const md5 = require('md5')
const generateHelper = require("../../helpers/generate.helper")
const systemConfig = require("../../config/system")

module.exports.index = async (req, res) => {
  const allAccounts = await Account.find({
    deleted: false
  })

  for (const account of allAccounts) {
    const roleId = account.role_id;
    const role = await Role.findOne({
      _id: roleId,
      deleted: false
    })
    account.role_title = role.title
  }

  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Tài khoản bên quản trị",
    allAccounts: allAccounts
  })
}

module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  })

  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Tạo tài khoản bên quản trị",
    roles: roles
  })
}

module.exports.createPost = async(req, res) => {
  req.body.password = md5(req.body.password)
  req.body.token = generateHelper.generateRandomString(30)
  
  const account = new Account(req.body)
  await account.save()

  res.redirect(`/${systemConfig.prefixAdmin}/accounts`)
}