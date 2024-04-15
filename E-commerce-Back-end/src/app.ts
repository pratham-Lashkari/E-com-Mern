import express from "express";
import { connetToDb } from "./Db/database.js";
import { errorMiddleweare } from "./middlewares/error.js";

// importing routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js"

const port = 4000;
const app = express();

connetToDb();

app.use(express.json());
app.use("/uploads" , express.static("uploads"));

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/product" , productRoutes);


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