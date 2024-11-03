const Cart = require("../../models/cart.model")

module.exports.cart = async (req, res, next) => {
  // nếu trong cookie không có cartId, thì chúng ta tạo ra 'cart' cho máy này
  // sau đó lưu id của 'cart' mới tạo này vào cookie
  if(!req.cookies.cartId){
    const expiresDay = 365 * 24 * 60 * 60 * 1000

    const cart = new Cart({
      expireAt: Date.now() + expiresDay //sau 1 năm sẽ xoá bản ghi này trong Database
    });
    await cart.save()

    // console.log(cart) in ra thông tin cart mới tạo


    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresDay) //sau 1 năm sẽ hết hạn cookie
    }) //lưu id của 'cart' mới tạo này vào cookie
  }

  next()
}