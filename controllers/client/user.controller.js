const User = require("../../models/user.model")
const md5 = require("md5")

const generateHelper = require('../../helpers/generate.helper')

module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký"
  })
}

module.exports.registerPost = async (req, res) => {
  const user = req.body

  // Check xem email đăng ký đã tồn tại hay chưa
  // nếu tồn tại rồi
  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  })
  if(existUser){
    req.flash("success", "Email đã tồn tại trong hệ thống")
    res.redirect('/user/register')
    return
  }

  // data hoàn chỉnh để lưu vào database
  const dataUser = {
    fullName: user.fullName,
    email: user.email,
    password: md5(user.password),
    token: generateHelper.generateRandomString(30),
    status: "active"
  }

  const newUser = new User(dataUser)
  await newUser.save()

  res.cookie("tokenUser", newUser.token) //lưu token user vào cookie để check đã đăng nhập hay chưa
  req.flash("success", "Đăng ký tài khoản thành công!");

  res.redirect("/")
}

module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập"
  })  
}

module.exports.loginPost = async (req, res) => {
  
  const user = await User.findOne({
    email: req.body.email,
    deleted: false
  })

  if(!user){
    req.flash("error", "email không tồn tại trong hệ thống")
    res.redirect("back")
    return
  }

  if(md5(req.body.password) !== user.password){
    req.flash("error", "Sai mật khẩu")
    res.redirect("back")
    return
  }

  res.cookie("tokenUser", user.token)
  res.redirect("/")
}

module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser")
  req.flash("success", "Đã đăng xuất")
  res.redirect('/')
}