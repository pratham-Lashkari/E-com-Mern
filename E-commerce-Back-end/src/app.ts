import express from "express";
import { connetToDb } from "./Db/database.js";
import { errorMiddleweare } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
// importing routes
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js"
import Stripe from "stripe";


const app = express();
app.use(cors());
export const myCache = new NodeCache();

config({
  path:"./.env"
})

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URI || "";
const stripKey = process.env.STRIPE_KEY || "";

export const stripe = new Stripe(stripKey);

connetToDb(mongoUrl);
console.log(morgan("dev"));

app.use(express.json());


app.use("/uploads" , express.static("uploads"));


app.use("/api/v1/user",userRoutes);
app.use("/api/v1/product" , productRoutes);
app.use("/api/v1/order" ,orderRoutes );
app.use("/api/v1/payment" ,paymentRoutes);
app.use("/api/v1/dashboard" , dashboardRoute);


app.get("/",(req,res)=>{
   res.status(200).send({
    success : true,
    message : "hello vaishali"
  })
})

app.use(errorMiddleweare);

app.listen(port , ()=>{
  console.log(`Express is working on http://localhost:${port}`);
})