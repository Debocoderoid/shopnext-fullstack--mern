const Product = require('../models/product.model')
const cloudinary = require('../config/cloudinary')

function uploadBufferToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
        stream.end(buffer);
    });
}

/**
 * @name getProducts
 * @description Retrieves all products sorted by their creation date.
 * @route GET /api/products/
 * @access Public
 */
async function getProducts(req, res) {
    try {
        const products = await Product.find({});

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


/**
 * @name getProductById
 * @description Retrieves a single product by its ID.
 * @route GET /api/products/:id
 * @access Public
 */
async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        
        if(product) {
            res.status(200).json(product)
        }
        else{
            res.status(404).json({
                message: "Server Error"
            })
        }
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}

/**
 * @name createProduct
 * @description Creates a new product, uploads its image to Cloudinary, and stores the product in the database.
 * @route POST /api/products
 * @access Private/Admin
 */
async function createProduct(req, res) {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "Product image is required"
            });
        }

        const result = await uploadBufferToCloudinary(req.file.buffer);

        const product = await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        res.status(201).json({
            message: "Product created successfully",
            product,
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}

/**
 * @name updateProduct
 * @description Updates an existing product and optionally replaces its image.
 * @route PUT /api/products/:id
 * @access Private/Admin
 */
async function updateProduct(req, res) {
    try {
        const { name, description, price, category, stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.category = category ?? product.category;
        product.stock = stock ?? product.stock;

        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(product.image.public_id);

            // Upload new image
            const result = await cloudinary.uploader.upload(req.file.path);

            product.image = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        const updatedProduct = await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct,
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}

/**
 * @name deleteProduct
 * @description Deletes a product and removes its associated image from Cloudinary.
 * @route DELETE /api/products/:id
 * @access Private/Admin
 */
async function deleteProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await cloudinary.uploader.destroy(product.image.public_id);

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
