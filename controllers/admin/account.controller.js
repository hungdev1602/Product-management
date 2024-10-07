module.exports.index = (req, res) => {
  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Tài khoản bên quản trị"
  })
}