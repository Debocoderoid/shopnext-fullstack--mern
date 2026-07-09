require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/db')
const authRoutes = require('./src/routes/auth.routes')
const productRoutes = require('./src/routes/product.routes')
const orderRoutes = require('./src/routes/order.routes')
const paymentRoutes = require('./src/routes/payment.routes')
const analyticsRoutes = require('./src/routes/analytics.routes')

const app = express()

//connect to database
connectDB()

//middlewares
app.use(cors(
    {
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL],
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// auth routes
app.use('/api/auth', authRoutes)

//product routes
app.use('/api/products', productRoutes)

// cart routes
app.use('/api/order', orderRoutes)

// payment routes
app.use('/api/payment', paymentRoutes)

// analytics routes
app.use("/api/analytics", analyticsRoutes)


const path = require('path')
// serve frontend in production
if(process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}
else {
    app.get("/", (req, res) => {
        res.send("shopnext backend is running")
    })
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})