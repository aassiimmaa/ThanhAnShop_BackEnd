const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/ProductController')
const { authMiddleWare } = require('../middleware/authMiddleware')

router.post('/create', ProductController.createProduct)
router.put('/update/:id', ProductController.updateProduct)
router.delete('/delete/:id', ProductController.deleteProduct)
router.get('/details/:id', ProductController.getDetailProduct)
router.get('/getAllProduct', ProductController.getAllProduct)
router.get('/getAllType', ProductController.getAllType)
router.post('/deleteMany', ProductController.deleteManyProduct)
module.exports = router