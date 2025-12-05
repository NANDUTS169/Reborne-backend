import express from "express";

import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Category Routes
router
  .route("/")
  .get(getCategories) // GET all categories
  .post(protect, admin, createCategory); // POST a new category

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);
export default router;
