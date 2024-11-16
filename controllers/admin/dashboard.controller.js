const Account = require("../../models/account.model")
const ProductCategory = require("../../models/product-category.model")
const Product = require("../../models/product.model")
const User = require("../../models/user.model")

module.exports.index = async (req, res) => {
  const statistic = {
    productCategory: {
      total: 0,
      active: 0,
      inactive: 0
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0
    },
    adminAccount: {
      total: 0,
      active: 0,
      inactive: 0
    },
    userAccount: {
      total: 0,
      active: 0,
      inactive: 0
    }
  }
  // Danh mục sản phẩm
  statistic.productCategory.total = await ProductCategory.countDocuments({
    deleted: false
  })
  statistic.productCategory.active = await ProductCategory.countDocuments({
    status: "active",
    deleted: false
  })
  statistic.productCategory.inactive = await ProductCategory.countDocuments({
    status: "inactive",
    deleted: false
  })
  // Hết Danh mục sản phẩm

  // Sản phẩm
  statistic.product.total = await Product.countDocuments({
    deleted: false
  })
  statistic.product.active = await Product.countDocuments({
    status: 'active',
    deleted: false
  })
  statistic.product.inactive = await Product.countDocuments({
    status: 'inactive',
    deleted: false
  })
  // Hết Sản phẩm
  // Tài khoản admin
  statistic.adminAccount.total = await Account.countDocuments({
    deleted: false
  })
  statistic.adminAccount.active = await Account.countDocuments({
    deleted: false,
    status: "active"
  })
  statistic.adminAccount.inactive = await Account.countDocuments({
    deleted: false,
    status: "inactive"
  })
  // Hết Tài khoản admin
  // Tài khoản người dùng
  statistic.userAccount.total = await User.countDocuments({
    deleted: false
  })
  statistic.userAccount.active = await User.countDocuments({
    deleted: false,
    status: "active"
  })
  statistic.userAccount.inactive = await User.countDocuments({
    deleted: false,
    status: "inactive"
  })
  // Hết Tài khoản người dùng

  res.render("admin/pages/dashboard/index.pug", {
    pageTitle: "Trang tong quan Admin",
    statistic: statistic
  })
}
