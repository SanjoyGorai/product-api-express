import express from "express";
import {
  createProduct,
  deleteAllProducts,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByQuery,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../middleware/fileUpload.js";

const router = express.Router();

router.post("/", upload.array("images", 10), createProduct);
// Route to get all products
router.get("/", getAllProducts);
// Route to get a product by ID
router.get("/:id", getProductById);
// Route to update a product by ID
router.put("/:id", updateProduct);
// Route to delete a product by ID
router.delete("/:id", deleteProduct);
// Route to delete all products
router.delete("/", deleteAllProducts);

router.get('/search/products', getProductsByQuery);

export default router;
