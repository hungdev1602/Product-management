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
  controller.createPost)

module.exports = router