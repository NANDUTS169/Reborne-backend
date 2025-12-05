import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, upload.array("images", 10), admin, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, upload.array("images", 10), admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
