import express from "express";

const app = express.Router();

// api/v1/dashboard/stats
app.get("/stats");

// api/v1/dashboard/pie
app.get("/pie");

// api/v1/dashboard/bar
app.get("/bar");

// api/v1/dashboard/line
app.get("/line");


export default app;