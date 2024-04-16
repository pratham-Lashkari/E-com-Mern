import express from "express";
import { connetToDb } from "./Db/database.js";
import { errorMiddleweare } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
// importing routes
import productRoutes from "./routes/product.js";
import userRoutes from "./routes/user.js";
import orderRoutes from "./routes/order.js";


const app = express();

export const myCache = new NodeCache();

config({
  path:"./.env"
})

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URI || "";

connetToDb(mongoUrl);
console.log(morgan("dev"));

app.use(express.json());
app.use("/uploads" , express.static("uploads"));


app.use("/api/v1/user",userRoutes);
app.use("/api/v1/product" , productRoutes);
app.use("/api/v1/order" ,orderRoutes );


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