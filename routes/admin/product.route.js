const express = require('express')
const router = express.Router()

const multer  = require('multer')

const upload = multer() 

const controller = require('../../controllers/admin/product.controller')

const validate = require('../../validates/admin/product.validate')

// Upload images to cloud
const middleware = require('../../middlewares/admin/uploadCloud.middleware')

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
  middleware.uploadSingleToCloud,
  validate.createPost,
  controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch(
  '/edit/:id', 
  upload.single('thumbnail'), 
  middleware.uploadSingleToCloud,
  validate.createPost,
  controller.editPatch
)

router.get('/detail/:id', controller.detail)
module.exports = router