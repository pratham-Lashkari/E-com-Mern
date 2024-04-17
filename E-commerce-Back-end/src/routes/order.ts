import express from "express";
import { allOrder, deleteOrder, getSingleOrder, myOrder, newOrder, processOrder } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();


// Route to create a new order
app.post("/new",newOrder);

// To get all my orders
app.get("/my" ,myOrder);

// View all order adminonly
app.get("/all" , adminOnly , allOrder);

// Get a single order
app.route("/:id").get(getSingleOrder).put( adminOnly , processOrder ).delete( adminOnly , deleteOrder);
 


export default app;