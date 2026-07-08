const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number, 
        required: true,
    },
    shippingAddress: {
        fullName: {type: String,required: true},
        phone: {type: String,required: true},
        address: {type: String,required: true},
        city: {type: String,required: true},
        state: {type: String,required: true},
        postalCode: {type: String,required: true},
        country: {type: String,required: true,default: "India"},
    },

    paymentID: {
      type: String,
      required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
    
},{
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order