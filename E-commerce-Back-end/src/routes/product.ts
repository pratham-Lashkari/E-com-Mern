import express  from "express";
import { singleUpload } from "../middlewares/multer.js";
import { addProduct, getAllCategories,getLatestProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// For creating products

app.post("/new" ,adminOnly,singleUpload , addProduct);

// for latest products
app.get ("/latest",getLatestProduct);

// For category
app.get("/category" ,getAllCategories );
export default app;