const Cart = require("../../models/cart.model")

module.exports.addPost = async (req, res) => {
  // 1) tìm giỏ hàng dựa trên ID được lưu ở cookie
  // 2) lưu sản phẩm đó vào mảng products của giỏ hàng đó
  const cartId = req.cookies.cartId //Id của cart

  const cart = await Cart.findOne({
    _id: cartId
  })

  const products = cart.products

  const existProductInCart = products.find(item => item.productId === req.params.id)

  if(existProductInCart){
    // nếu tồn tại sản phẩm này trong giỏ hàng rồi, chúng ta update quantity là xong
    existProductInCart.quantity += parseInt(req.body.quantity)
  }
  else{
    // chưa tồn tại sản phẩm này trong giỏ hàng, chúng ta sẽ tạo mới và lưu vào giỏ hàng
    const product = {
      productId: req.params.id, //id của sản phẩm cần lưu vào giỏ hàng
      quantity: parseInt(req.body.quantity) //số lượng của sản phẩm đó
    }

    products.push(product)
  }

  

  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  })

  req.flash('success', 'Đã thêm vào giỏ hàng')
  res.redirect('back')
}