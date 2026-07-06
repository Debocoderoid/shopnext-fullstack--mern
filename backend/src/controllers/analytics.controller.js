const User = require('../models/user.model')
const Order = require('../models/order.model')
const Product = require('../models/product.model')

/**
 * @name getAdminStats
 * @description Retrieves dashboard statistics for the admin.
 * @route GET /api/analytics/
 * @access Private/Admin
 */
async function getAdminStats(req, res) {
    try {
        const totalUsers = await User.countDocuments({ role : 'user'});

        const totalProducts = await Product.countDocuments({});

        const totalOrders = await Order.countDocuments({});

        const orders = await Order.find({})

        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)

        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
        });

    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch admin statistics",
            error: err.message,
        });
    }
}

module.exports = {
    getAdminStats,
};