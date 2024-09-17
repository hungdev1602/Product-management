const express = require('express')
const router = express.Router()

const controller = require('../../controllers/admin/product.controller')

router.get('/', controller.index)

router.get('/trash', controller.trash)

router.patch('/change-status', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.patch('/delete', controller.delete)

router.patch('/restore', controller.restore)

router.delete('/delete-permanently', controller.deletePermanently)

module.exports = router