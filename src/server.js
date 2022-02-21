import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import productRouter from "./services/products/index.js"
import reviewRouter from "./services/reviews/index.js"
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js"
import mongoose from "mongoose"

const server = express()

const port = process.env.PORT || 3001
const whiteListedOrigins = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]


server.use(
    cors({
      origin: function (origin, next) {
        console.log("ORIGIN: ", origin)
  
        if (!origin || whiteListedOrigins.indexOf(origin) !== -1) {
          console.log("YAY!")
          next(null, true)
        } else {
          next(new Error("CORS ERROR!"))
        }
      },
    })
  )
  

  server.use(express.json())



  mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server runnning on port: ", port)
  })
})
