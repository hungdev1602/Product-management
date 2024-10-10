const dashboardRoute = require('./dashboard.route')
const productRoute = require('./product.route')
const productCategoryRoute = require('./products-category.route')
const roleRoute = require('./roles.route')
const accountRoute = require('./account.route')
const authRoute = require('./auth.route')

const systemConfig = require('../../config/system')
module.exports.index = (app) => {
  const PATH_ADMIN = `/${systemConfig.prefixAdmin}`

  app.use(`${PATH_ADMIN}/dashboard`, dashboardRoute)

  app.use(`${PATH_ADMIN}/products`, productRoute)

  app.use(`${PATH_ADMIN}/products-category`, productCategoryRoute)

  app.use(`${PATH_ADMIN}/roles`, roleRoute)

  app.use(`${PATH_ADMIN}/accounts`, accountRoute)

  app.use(`${PATH_ADMIN}/auth`, authRoute)
}