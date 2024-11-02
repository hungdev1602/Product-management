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

  // Lấy ra tất cả category (lấy các category con)
  const allCategoryChildren = []

  const getCategoryChildren = async (parentId) => {
    const childs = await ProductCategory.find({
      parent_id: parentId, //!!
      status: "active",
      deleted: false
    })

    for (const item of childs) {
      allCategoryChildren.push(item.id) //nếu lấy item._id thay vì item.id nó sẽ lấy objectId trong mongoDB thay vì string
      getCategoryChildren(item.id) //lấy tiếp tất cả những category con thuộc category con này (Đệ quy)
    }
  }

  // gọi hàm lấy các category con
  await getCategoryChildren(category._id)

  // category._id là id cha, lấy theo slug. Sau đó phải lấy các danh mục con của thg cha này
  const products = await Product
    .find({
      category_id: { $in: [category._id, ...allCategoryChildren]}, //sẽ lấy tất cả category_id nằm trong cái mảng này
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