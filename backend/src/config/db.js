const mongoose = require('mongoose')

async function connectDB() {
    
    try {
        await mongoose.connect(process.env.MONGO_URI)

        console.log("database is connected")
    }
    catch(err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB