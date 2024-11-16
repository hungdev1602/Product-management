const productRoute = require("./product.route")
const homeRoute = require("./home.route")
const cartRoute = require("./cart.route")
const orderRoute = require("./order.route")
const userRoute = require("./user.route")

const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware")

module.exports.index = (app) => {
  app.use(categoryMiddleware.category); //Tất cả các router đều chạy qua middleware này (cách viết tắt)

  app.use(cartMiddleware.cart); //Tất cả các router đều chạy qua middleware này (cách viết tắt)

  app.use(userMiddleware.auth);

  app.use(settingMiddleware.settingGeneral);

  app.use('/', homeRoute)
  
  app.use('/products', productRoute)

  app.use('/cart', cartRoute)

  app.use('/order', orderRoute)

  app.use('/user', userRoute)

  app.get("*", (req, res) => {
    res.render("client/pages/404/404.pug")
  })
}