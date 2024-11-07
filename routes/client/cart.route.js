const express = require('express')
const router = express.Router()

const controller = require('../../controllers/client/cart.controller')

router.get('/', controller.index)

router.delete('/delete', controller.delete)

router.post('/add/:id', controller.addPost)

module.exports = router