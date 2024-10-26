const productRoute = require("./product.route")
const homeRoute = require("./home.route")

const categoryMiddleware = require("../../middlewares/client/category.middleware")
module.exports.index = (app) => {
  app.use(categoryMiddleware.category); //Tất cả các router đều chạy qua middleware này (cách viết tắt)

  app.use('/', homeRoute)
  
  app.use('/products', productRoute)
}