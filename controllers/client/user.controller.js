const User = require("../../models/user.model")
const md5 = require("md5")

const generateHelper = require('../../helpers/generate.helper')
const sendMailHelper = require('../../helpers/sendMail.helper')

const ForgotPassword = require("../../models/forgot-password.model")

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

module.exports.passwordForgot = async (req, res) => {
  res.render("client/pages/user/password-forgot.pug", {
    pageTitle: "Lấy lại mật khẩu"
  })
}

module.exports.passwordForgotPost = async (req, res) => {
  const email = req.body.email
  const existUser = await User.findOne({
    email: email,
    status: "active",
    deleted: false
  })
  if(!existUser){
    req.flash("error", "email không tồn tại trong hệ thống")
    res.redirect("back")
    return
  }
  
  // check để ko bị gửi và lưu 2 mã otp cho 1 email
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email
  })
  if(!existEmailInForgotPassword){
    // bước 1: Lưu email và mã otp và database forgot password
    const otp = generateHelper.generateRandomNumber(6)

    const data = {
      email: email,
      otp: otp,
      expiredAt: Date.now() + 5 * 60 * 1000
    }

    const record = new ForgotPassword(data)
    await record.save()

    // bước 2: gửi mã otp vào email của khách
    const subject = `Xác thực mã OTP`
    const text = `Mã OTP của bạn là: <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`
    sendMailHelper.sendMail(email, subject, text)
  }

  
  res.redirect(`/user/password/otp?email=${email}`)
}

module.exports.passwordOtp = async (req, res) => {
  const email = req.query.email

  res.render("client/pages/user/password-otp.pug", {
    pageTitle: "Nhập mã OTP",
    email: email
  })
}

module.exports.passwordOtpPost = async (req, res) => {
  const checkOtp = await ForgotPassword.findOne({
    email: req.body.email,
    otp: req.body.otp
  })

  if(!checkOtp){
    req.flash("error", "Sai mã OTP")
    res.redirect("back")
    return
  }

  const user = await User.findOne({
    email: req.body.email
  })

  res.cookie("tokenUser", user.token)
  res.redirect("/user/password/reset")
}

module.exports.passwordReset = async (req, res) => {
  res.render("client/pages/user/password-reset.pug", {  
    pageTitle: "Lấy lại mật khẩu"
  })
}

module.exports.passwordResetPost = async (req, res) => {
  const newPassword = req.body.password
  const tokenUser = req.cookies.tokenUser

  await User.updateOne({
    token: tokenUser,
    status: "active",
    deleted: false
  }, {
    password: md5(newPassword)
  })
  
  req.flash("success", "Thay đổi mật khẩu thành công")
  res.redirect("/")
}