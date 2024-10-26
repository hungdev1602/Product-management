const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model")

module.exports.index = async (req, res) => {
  const products = await Product
    .find({
      status: "active",
      deleted: false
    })
    .sort({
      position: "desc"
    })

  for (const item of products) {
    const discountPrice = item.price * item.discountPercentage / 100;
    item.priceNew = (item.price - discountPrice).toFixed(0)
  }

  res.render("client/pages/products/index.pug", {
    pageTitle: "Danh sach san pham",
    products: products
  })
}

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const product = await Product
    .findOne({
      slug: slug,
      status: "active",
      deleted: false
    })

  const discountPrice = product.price * product.discountPercentage / 100;
  product.priceNew = (product.price - discountPrice).toFixed(0)

  console.log(product)

  res.render("client/pages/products/detail.pug", {
    pageTitle: product.title,
    product: product
  })
}

module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  const category = await ProductCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active"
  })

  const products = await Product.find({
    category_id: category._id,
    status: "active",
    deleted: false
  })
    .sort({
      position: "desc"
    })

  for (const item of products) {
    const discountPrice = item.price * item.discountPercentage / 100;
    item.priceNew = (item.price - discountPrice).toFixed(0)
  }
  
  
  res.render("client/pages/products/index.pug", {
    pageTitle: `Sản phẩm ${category.title}`,
    products: products
  })
}