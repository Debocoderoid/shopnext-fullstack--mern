const express = require('express')
const router = express.Router()

const {getProducts, getProductById, createProduct, updateProduct, deleteProduct} = require('../controllers/product.controller')
const {protect} = require('../middlewares/auth.middleware')
const {admin} = require('../middlewares/admin.middleware')

const multer = require('multer')
const upload = multer({ dest: 'uploads/'})

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", protect, admin, upload.single('image'), createProduct)
router.put("/:id", protect, admin, upload.single('image'), updateProduct)
router.delete("/:id", protect, admin, deleteProduct)

module.exports = router