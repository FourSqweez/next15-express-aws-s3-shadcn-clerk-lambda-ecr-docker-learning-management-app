import { clerkMiddleware, createClerkClient, requireAuth } from "@clerk/express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import * as dynamoose from "dynamoose"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import courseRoutes from "./routes/courseRoutes"
import userClerkRoutes from "./routes/userClerkRoutes"

// configurations
dotenv.config()

const isProduction = process.env.NODE_ENV === "production"

if (!isProduction) {
  dynamoose.aws.ddb.local()
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

const app = express()
app.use(express.json()) // for parsing application/json
app.use(cors()) // for cross origin requests
app.use(helmet()) // for security
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })) // for security
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded
app.use(morgan("common")) // for logging
app.use(clerkMiddleware())

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/courses", courseRoutes)
app.use("/user/clerk", requireAuth(), userClerkRoutes)

// Start server
const port = process.env.PORT || 8001
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
  })
}
