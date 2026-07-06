const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getUsers, verifyEmail} = require('../controllers/auth.controller')
const {protect} = require('../middlewares/auth.middleware')
const {admin} = require('../middlewares/admin.middleware')

router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/users", protect, admin, getUsers)

router.post("/verify-email", verifyEmail)

module.exports = router