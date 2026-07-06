const razorpay = require('razorpay')
const crypto = require('crypto')
dotenv = require('dotenv').config()


/**
 * @name createdOrder
 * @description Creates a Razorpay order for the specified payment amount and returns the Razorpay order details to the client.
 * @route POST /api/payment/order
 * @access Private
 */
async function createdOrder(req, res) {
    try {
        const instance = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        const order = await instance.orders.create(options)
        res.status(200).json(order)
    }
    catch(err) {
        res.status(500).json({
            message: "Failed to create Razorpay order",
            error: err.message
        });
    }
}


/**
 * @name verifyPayment
 * @description Verifies the Razorpay payment signature to ensure the payment is authentic.
 * @route POST /api/payment/payment
 * @access Private
 */
async function verifyPayment(req, res) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
}





module.exports = {
    createdOrder,
    verifyPayment
}