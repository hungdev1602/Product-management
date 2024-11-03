const productRoute = require("./product.route")
const homeRoute = require("./home.route")
const cartRoute = require("./cart.route")

const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
module.exports.index = (app) => {
  app.use(categoryMiddleware.category); //Tất cả các router đều chạy qua middleware này (cách viết tắt)

  app.use(cartMiddleware.cart); //Tất cả các router đều chạy qua middleware này (cách viết tắt)

  app.use('/', homeRoute)
  
  app.use('/products', productRoute)

  app.use('/cart', cartRoute)
}