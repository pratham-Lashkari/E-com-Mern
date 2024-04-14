import express from "express";
import { deleteUser, getAllUser, getUser, newUser } from "../controllers/user.js";
const app = express.Router();

// Creating user
app.post("/new",newUser);

// Get all user
app.get("/all" , getAllUser);

// Get a single user by id and delete by id
app.route("/:id").get(getUser).delete(deleteUser);

export default app;