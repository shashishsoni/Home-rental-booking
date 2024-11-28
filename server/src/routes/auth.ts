const router = require("express").Router()
const bcrypt = require("bcryptjs")
const multer = require("multer")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

router.post("/signup", upload.single("profileImage"), async (req, res) => {
        try {
            const {firstname, lastname, email, password} = req.body
        } catch (err) {}
})