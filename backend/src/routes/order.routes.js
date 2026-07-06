const express = require('express')

const { protect } = require('../middlewares/auth.middleware')
const { admin } = require('../middlewares/admin.middleware')

const { createOrder, getOrders, myOrders, updateOrderStatus } = require('../controllers/order.controller')

const router = express.Router()

router.post('/', protect, createOrder)
router.get('/', protect, admin, getOrders)
router.get('/myorders', protect, myOrders)
router.put('/:id/status', protect, admin, updateOrderStatus)

module.exports = router