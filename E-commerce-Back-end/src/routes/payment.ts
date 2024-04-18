import express from "express";
import { applyDiscount, deleteCupon, getAllCupons, newCupon } from "../controllers/cupon.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// For creating a cupon 
app.post("/coupon/new" , newCupon);

// getting discount
app.get("/discount",adminOnly ,applyDiscount);

// Get All Cupons
app.get("/all/cupons" , adminOnly , getAllCupons);

app.delete("/cupon/:id" , adminOnly , deleteCupon);


export default app;