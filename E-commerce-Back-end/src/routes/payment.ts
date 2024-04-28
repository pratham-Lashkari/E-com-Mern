import express from "express";
import { applyDiscount, createPaymentIntent, deleteCupon, getAllCupons, newCupon } from "../controllers/cupon.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// For creating a cupon 
app.post("/coupon/new",adminOnly ,newCupon );


// For creating  payement 
app.post("/create" , createPaymentIntent);

// getting discount
app.get("/discount" ,applyDiscount);

// Get All Cupons
app.get("/all/cupons" , adminOnly , getAllCupons);

app.delete("/cupon/:id" , adminOnly , deleteCupon);

export default app;