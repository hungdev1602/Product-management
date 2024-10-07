const express = require('express')
const router = express.Router()
const multer  = require('multer')

const upload = multer() 

const controller = require('../../controllers/admin/product-category.controller')

const middleware = require('../../middlewares/admin/uploadCloud.middleware')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post(
  '/create', 
  upload.single('thumbnail'), 
  middleware.uploadSingleToCloud,
  controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch(
  '/edit/:id', 
  upload.single('thumbnail'), 
  middleware.uploadSingleToCloud,
  controller.editPatch
)

router.patch('/change-status', controller.changeStatus)

router.patch('/change-position', controller.changePosition)

router.get('/trash', controller.trash)

router.patch('/delete', controller.delete)

router.patch('/restore', controller.restore)

router.delete('/permanently-delete', controller.permanentlyDelete)

router.get('/detail/:id', controller.detail)

module.exports = router