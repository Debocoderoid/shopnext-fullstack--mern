const Order = require('../models/order.model')
const sendEmail = require('../utils/sendEmail')


/**
 * @name createOrder
 * @description Creates a new order for the authenticated user.
 * @route POST /api/orders/
 * @access Private
 */
async function createOrder(req, res) {
    try{
        const { items, totalAmount, address, paymentId } = req.body

        if(!items || items.length == 0 || !totalAmount || !address) {
            return res.status(400).json({
                message: "Invalid order data"
            })
        }

        const order = await Order.create({
            userId: req.user._id,
            products: items,
            totalAmount,
            shippingAddress: address,
            paymentID: paymentId,
        });

        const message = `
        Hi ${req.user.name},

        Thank you for shopping with ShopNext!

        We're happy to let you know that your order has been placed successfully and is now being processed.

        Order Details:
        • Order ID: ${order._id}
        • Total Amount: ₹${order.totalAmount}
        • Order Status: Pending

        We'll notify you once your order has been shipped.

        Thank you for choosing ShopNext!

        Best regards,
        Team ShopNext
        `

        await sendEmail(req.user.email, 'Order Created', message)

        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    }   
    catch(err) {
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}


/**
 * @name getOrders
 * @description Retrieves all orders along with the user's name and email.
 * @route GET /api/orders/
 * @access Private/Admin
 */
async function getOrders(req, res) {
    try {
        const orders = await Order.find({}).populate('userId', 'name email').populate('products.productId', 'name price image')
        res.json(orders)
    }
    catch(err) {
        res.status(500).json({
            message: "Error fetching orderd",
            err
        })
    }
}

/**
 * @name myOrders
 * @description Retrieves all orders placed by the authenticated user.
 * @route GET /api/orders/myorders
 * @access Private
 */
async function myOrders(req, res) {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('products.productId', 'name price image');

        res.status(200).json(orders);

    } catch (err) {
        res.status(500).json({
            message: "Error fetching orders",
            error: err.message,
        });
    }
}


/**
 * @name updateOrderStatus
 * @description Updates the status of an order.
 * @route PUT /api/orders/:id/status
 * @access Private/Admin
 */
async function updateOrderStatus(req, res) {
    try {
        const { status } = req.body

        const order = await Order.findById(req.params.id)

        if(!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        
        order.status = status
        await order.save()

        return res.status(200).json({
            message: "order status updated",
            order
        })
        
    }
    catch(err) {
        res.status(500).json({
            message: "Server error",
            error: err.message
        })
    }
}



module.exports = {
    createOrder,
    getOrders,
    myOrders,
    updateOrderStatus
}