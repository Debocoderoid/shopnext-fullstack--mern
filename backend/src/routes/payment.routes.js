const express = require('express')

const router = express.Router()

const {createdOrder, verifyPayment} = require('../controllers/payment.controller')

router.post('/order', createdOrder)
router.post('/verify-payment', verifyPayment)

module.exports = router