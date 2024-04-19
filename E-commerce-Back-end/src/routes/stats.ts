import express from "express";
import { getBarCharts, getDashboardStats, getLineCharts, getPieCharts } from "../controllers/stats.js";

const app = express.Router();

// api/v1/dashboard/stats
app.get("/stats" , getDashboardStats);

// api/v1/dashboard/pie
app.get("/pie",getPieCharts);

// api/v1/dashboard/bar
app.get("/bar" , getBarCharts);

// api/v1/dashboard/line
app.get("/line" , getLineCharts);


export default app;