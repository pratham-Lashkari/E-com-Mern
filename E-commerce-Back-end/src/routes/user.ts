import express from "express";
import { deleteUser, getAllUser, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();

// Creating user
app.post("/new",newUser);

// Get all user
app.get("/all" , adminOnly ,getAllUser);

// Get a single user by id and delete by id
app.route("/:id").get(getUser).delete(adminOnly , deleteUser);

export default app;