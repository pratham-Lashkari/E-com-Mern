import express  from "express";
import { singleUpload } from "../middlewares/multer.js";
import { addProduct, getAdminProduct, getAllCategories,getLatestProduct, getSingleProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// For creating products

app.post("/new" ,adminOnly,singleUpload , addProduct);

// for latest products
app.get ("/latest",getLatestProduct);

// For category
app.get("/category" ,getAllCategories );

// to get all products
app.get("/admin-product",adminOnly,getAdminProduct);

app.route("/:id").get(getSingleProduct);

export default app;