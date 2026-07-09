const mongoose = require('mongoose')

let cached = global._mongooseConn

if (!cached) {
    cached = global._mongooseConn = { conn: null, promise: null }
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
        }).then((mongooseInstance) => {
            console.log("database is connected")
            return mongooseInstance
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (err) {
        cached.promise = null
        console.error("Database connection failed:", err.message)
        throw err
    }

    return cached.conn
}

module.exports = connectDB
