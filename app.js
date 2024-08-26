import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, this is the API for managing products!");
});

// API versioning
app.use("/api/v1/products", productRoutes);

export default app;
