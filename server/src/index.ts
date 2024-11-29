import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authroutes from "./routes/auth"

const  app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))


//routes

app.use("/auth", authroutes)

// Database setup

const PORT = 3333;
const mongoUri = process.env.MONGO_DB;

if (!mongoUri) {
  throw new Error('MONGO_DB environment variable is not defined');
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log("connected to Database succesfully")
    })
    .catch((err) => {
        console.log("Failes to connect the Database:", err)
    });


// Database setup
