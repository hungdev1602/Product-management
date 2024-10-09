const express = require('express')
const router = express.Router()

const multer  = require('multer')

const upload = multer() 

// Upload images to cloud
const middleware = require('../../middlewares/admin/uploadCloud.middleware')

const controller = require('../../controllers/admin/account.controller')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post(
  '/create', 
  upload.single('avatar'), 
  middleware.uploadSingleToCloud,
  controller.createPost
)

router.get('/edit/:id', controller.edit)

router.patch(
  '/edit/:id', 
  upload.single('avatar'), 
  middleware.uploadSingleToCloud,
  controller.editPatch
)

router.get('/change-password/:id', controller.changePassword)

router.patch('/change-password/:id', controller.changePasswordPatch)

module.exports = router