require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("./src/config/db");

const User = require("./src/models/user.model");
const Product = require("./src/models/product.model");
const Order = require("./src/models/order.model");

async function seedDatabase() {
    try {
        await connectDB();

        console.log("Connected to MongoDB...");

        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

        console.log("Old data deleted...");

        const hashedPassword = await bcrypt.hash("123456", 10);

        const users = await User.insertMany([
            {
                name: "Admin",
                email: "admin@shopnext.com",
                password: hashedPassword,
                role: "admin",
                verified: true,
            },
            {
                name: "Debojyoti Civil",
                email: "debo@example.com",
                password: hashedPassword,
                role: "user",
                verified: true,
            },
            {
                name: "Rahul Sharma",
                email: "rahul@example.com",
                password: hashedPassword,
                role: "user",
                verified: true,
            },
            {
                name: "Priya Singh",
                email: "priya@example.com",
                password: hashedPassword,
                role: "user",
                verified: true,
            },
        ]);

        const admin = users[0];
        const debo = users[1];
        const rahul = users[2];
        const priya = users[3];

        const products = await Product.insertMany([
            {
                name: "iPhone 16 Pro",
                description: "Apple flagship smartphone",
                price: 129900,
                category: "Smartphones",
                brand: "Apple",
                stock: 12,
                image: {
                    public_id: "iphone16pro",
                    url: "https://dummyimage.com/600x400/000/fff",
                },
            },
            {
                name: "Samsung Galaxy S25 Ultra",
                description: "Latest Samsung flagship",
                price: 124999,
                category: "Smartphones",
                brand: "Samsung",
                stock: 15,
                image: {
                    public_id: "s25ultra",
                    url: "https://dummyimage.com/600x400/000/fff",
                },
            },
            {
                name: "MacBook Air M4",
                description: "Apple M4 laptop",
                price: 129900,
                category: "Laptops",
                brand: "Apple",
                stock: 8,
                image: {
                    public_id: "macbookair",
                    url: "https://dummyimage.com/600x400/000/fff",
                },
            },
            {
                name: "Sony WH-1000XM5",
                description: "Noise cancelling headphones",
                price: 29999,
                category: "Audio",
                brand: "Sony",
                stock: 20,
                image: {
                    public_id: "sonyxm5",
                    url: "https://dummyimage.com/600x400/000/fff",
                },
            },
            {
                name: "Apple Watch Series 10",
                description: "Premium smartwatch",
                price: 49999,
                category: "Wearables",
                brand: "Apple",
                stock: 18,
                image: {
                    public_id: "watch10",
                    url: "https://dummyimage.com/600x400/000/fff",
                },
            },
            {
                name: "Dell XPS 15",
                description: "High-performance Windows laptop",
                price: 159999,
                category: "Laptops",
                brand: "Dell",
                stock: 7,
                image: {
                    public_id: "xps15",
                    url: "https://dummyimage.com/600x400/000/fff",
                },
            },
            {
                name: "Nothing Ear (3)",
                description: "True wireless earbuds",
                price: 9999,
                category: "Audio",
                brand: "Nothing",
                stock: 35,
                image: {
                    public_id: "nothingear3",
                    url: "https://dummyimage.com/600x400/000/fff",
                },
            },
            {
                name: "iPad Air M3",
                description: "Apple tablet with M3 chip",
                price: 69999,
                category: "Tablets",
                brand: "Apple",
                stock: 10,
                image: {
                    public_id: "ipadair",
                    url: "https://dummyimage.com/600x400/000/fff",
                },
            },
        ]);

        await Order.insertMany([
            {
                userId: debo._id,
                products: [
                    {
                        productId: products[0]._id,
                        quantity: 1,
                        price: products[0].price,
                    },
                    {
                        productId: products[3]._id,
                        quantity: 1,
                        price: products[3].price,
                    },
                ],
                totalAmount: products[0].price + products[3].price,
                shippingAddress: {
                    fullName: "Debojyoti Civil",
                    phone: "9876543210",
                    address: "Room 312, Hostel C",
                    city: "Hyderabad",
                    state: "Telangana",
                    postalCode: "502285",
                    country: "India",
                },
                paymentID: "PAY1001",
                status: "pending",
            },
            {
                userId: debo._id,
                products: [
                    {
                        productId: products[6]._id,
                        quantity: 2,
                        price: products[6].price,
                    },
                ],
                totalAmount: products[6].price * 2,
                shippingAddress: {
                    fullName: "Debojyoti Civil",
                    phone: "9876543210",
                    address: "Room 312, Hostel C",
                    city: "Hyderabad",
                    state: "Telangana",
                    postalCode: "502285",
                    country: "India",
                },
                paymentID: "PAY1002",
                status: "delivered",
            },
            {
                userId: rahul._id,
                products: [
                    {
                        productId: products[2]._id,
                        quantity: 1,
                        price: products[2].price,
                    },
                ],
                totalAmount: products[2].price,
                shippingAddress: {
                    fullName: "Rahul Sharma",
                    phone: "9123456780",
                    address: "Banjara Hills",
                    city: "Hyderabad",
                    state: "Telangana",
                    postalCode: "500034",
                    country: "India",
                },
                paymentID: "PAY1003",
                status: "processing",
            },
            {
                userId: priya._id,
                products: [
                    {
                        productId: products[4]._id,
                        quantity: 1,
                        price: products[4].price,
                    },
                    {
                        productId: products[7]._id,
                        quantity: 1,
                        price: products[7].price,
                    },
                ],
                totalAmount: products[4].price + products[7].price,
                shippingAddress: {
                    fullName: "Priya Singh",
                    phone: "9988776655",
                    address: "Madhapur",
                    city: "Hyderabad",
                    state: "Telangana",
                    postalCode: "500081",
                    country: "India",
                },
                paymentID: "PAY1004",
                status: "shipped",
            },
            {
                userId: rahul._id,
                products: [
                    {
                        productId: products[1]._id,
                        quantity: 1,
                        price: products[1].price,
                    },
                ],
                totalAmount: products[1].price,
                shippingAddress: {
                    fullName: "Rahul Sharma",
                    phone: "9123456780",
                    address: "Banjara Hills",
                    city: "Hyderabad",
                    state: "Telangana",
                    postalCode: "500034",
                    country: "India",
                },
                paymentID: "PAY1005",
                status: "cancelled",
            },
        ]);

        console.log("Database seeded successfully!");
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedDatabase();