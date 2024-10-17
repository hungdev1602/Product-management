const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model")
module.exports.requireAuth = async (req, res, next) => {
  // Bước 1: nếu ko có token trong cookie => nghĩa là chưa đăng nhập, đẩy về trang đăng nhập
  if(!req.cookies.token){
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  // Bước 2: nếu có token là đã đăng nhập, bây giờ check xem có user nào có token như vậy hay ko, nếu ko thì xoá cookie và ném về trang đăng nhập
  // Tránh hacker điền token lung tung mà vẫn vô dc
  const user = await Account.findOne({
    token: req.cookies.token,
    deleted: false,
    status: "active"
  })

  // Ko thấy user có token đó thì chỉ có hacker, ném về trang đăng nhập
  if(!user){
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  const role = await Role.findOne({
    _id: user.role_id,
    deleted: false
  })

  // trả về cho bên pug 1 biến => res.locals
  res.locals.user = user;
  res.locals.role = role;

  next();
}