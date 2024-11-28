import { send } from "process"
import {Request, Response} from "express"
import { Router } from "express" 
import bcrypt from 'bcryptjs';
import multer from "multer"
import jwt from "jsonwebtoken"

const User = require("../models/user")

//configuration multer for a file  
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/") // store in upload folder
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

Router.post("/signup", upload.single("profileImage"), async (req:Request, res:Response) => {
    try {
        const { firstname, lastname, email, password } = req.body

        const profileImage = req.body

        if(!profileImage) {
            return res.status(400).send("no file uploaded")
        }
    } catch (err) { }
})