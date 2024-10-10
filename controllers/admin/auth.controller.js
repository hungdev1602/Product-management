const Account = require("../../models/account.model");
const md5 = require("md5")
const systemConfig = require("../../config/system")
module.exports.login = (req, res) => {
  res.render("admin/pages/auth/login.pug", {
    pageTitle: "Trang đăng nhập"
  })
}

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  // bước 1: check email
  const user = await Account.findOne({
    email: email,
    deleted: false
  })

  // nếu email ko tồn tại trong database thì user == null
  if(!user){
    req.flash("error", "email not exist");
    res.redirect("back");
    return;
  }

  // bước 2: kiểm tra mật khẩu xem có khớp với user đó không
  if(md5(password) !== user.password){
    req.flash("error", "wrong password");
    res.redirect("back");
    return;
  }

  // bước 3: kiểm tra tài khoản có bị khoá ko
  if(user.status !== "active"){
    req.flash("error", "account blocked");
    res.redirect("back");
    return;
  }
  
  // sau khi đăng nhập thành công, lưu token của user đó vào cookie
  res.cookie("token", user.token)
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`)
}