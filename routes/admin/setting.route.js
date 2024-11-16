const express = require('express')
const router = express.Router()

const multer  = require('multer')

const upload = multer() 
// Upload images to cloud
const middleware = require('../../middlewares/admin/uploadCloud.middleware')

const controller = require('../../controllers/admin/setting.controller')

router.get('/general', controller.general)

router.patch(
  '/general', 
  upload.single('logo'), 
  middleware.uploadSingleToCloud,
  controller.generalPatch
)

module.exports = router