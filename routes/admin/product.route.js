const express = require('express')
const router = express.Router()

const multer  = require('multer')

// custom lại tên file ảnh khi lưu từ FE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/') //lưu ảnh vào mục này
  },
  filename: function (req, file, cb) {
    const fieldName = `${Date.now()}-${file.originalname}`; //định dạng tên file ảnh khi lưu
    cb(null, fieldName)
  }
})
const upload = multer({ storage: storage }) 

const controller = require('../../controllers/admin/product.controller')

const validate = require('../../validates/admin/product.validate')

router.get('/', controller.index)

router.get('/trash', controller.trash)

router.patch('/change-status', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.patch('/delete', controller.delete)

router.patch('/restore', controller.restore)

router.delete('/delete-permanently', controller.deletePermanently)

router.patch('/change-position', controller.changePosition)

router.get('/create', controller.create)

router.post(
  '/create', 
  upload.single('thumbnail'), 
  validate.createPost,
  controller.createPost
)

module.exports = router