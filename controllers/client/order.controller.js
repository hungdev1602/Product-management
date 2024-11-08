const Cart = require("../../models/cart.model")
const Order = require("../../models/order.model")
const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId
  
  const cart = await Cart.findOne({
    _id: cartId
  })

  const products = cart.products
  let totalSum = 0

  for (const item of products) {
    const infoProduct = await Product.findOne({
      _id: item.productId
    })

    item.thumbnail = infoProduct.thumbnail
    item.title = infoProduct.title
    item.newPrice = infoProduct.price
    if(infoProduct.discountPercentage > 0){
      const discount = (infoProduct.price * infoProduct.discountPercentage / 100)
      item.newPrice = parseInt((infoProduct.price - discount).toFixed(0))
    }

    item.total = item.newPrice * item.quantity
    totalSum += item.total
  }

  res.render("client/pages/order/index.pug", {
    pageTitle: "Đặt hàng",
    products: products,
    totalSum: totalSum
  })
}

module.exports.orderPost = async (req, res) => {
  const cartId = req.cookies.cartId
  const order = req.body

  // dataOrder -> Đây sẽ là data để lưu vào database
  // cần phải sửa lại mảng products của đơn hàng
  // {
  //  productId,
  //  price,
  //  discountPercentage
  //  quantity
  // }
  const dataOrder = {
    fullName: order.fullName,
    phone: order.phone,
    address: order.address,
    products: []
  }

  const cart = await Cart.findOne({
    _id: cartId
  })
  const products = cart.products
  for (const item of products) {
    const productInfo = await Product.findOne({
      _id: item.productId
    })

    const product = {
      productId: item.productId,
      price: productInfo.price,
      discountPercentage: productInfo.discountPercentage,
      quantity: item.quantity
    }

    dataOrder.products.push(product)
  }

  const newOrder = new Order(dataOrder)
  await newOrder.save() //lưu vào database

  await Cart.updateOne({
    _id: cartId
  }, {
    products: []
  })

  res.redirect(`/order/success/${newOrder.id}`)
}