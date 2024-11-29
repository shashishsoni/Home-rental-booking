import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authroutes from "./routes/auth"
import errorHandler from "./middleware/errorHandler"

const  app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

//cors()

app.use(cors({
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
}))

//routes

app.use("/auth", authroutes)

//middleware

app.use(errorHandler)

// Database setup

const PORT = 3333;
const mongoUri = process.env.MONGO_DB;

app.listen(3333, () => {
    console.log("server is rurring on port 3333")
})

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
