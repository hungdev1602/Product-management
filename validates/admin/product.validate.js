module.exports.createPost = (req, res, next) => {
  if(!req.body.title){
    req.flash("error", "Tiêu đề không được để trống")
    res.redirect("back")
    return;
  }

  if(req.body.price <= 0){
    req.flash("error", "Giá sản phẩm phải lớn hơn 0$")
    res.redirect("back")
    return;
  }

  next();
}