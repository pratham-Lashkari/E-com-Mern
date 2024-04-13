import express from "express";
import { connetToDb } from "./Db/database.js";
import userRoutes from "./routes/user.js";
const port = 4000;
const app = express();

connetToDb();

app.use(express.json());
app.use("/api/v1/user",userRoutes);

app.get("/",(req,res)=>{
   res.status(200).send({
    success : true,
    message : "hello vaishali"
  })
})

app.listen(port , ()=>{
  console.log(`Express is working on http://localhost:${port}`);
})