import asyncHandler from "express-async-handler";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";

// GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: "i" } }
    : {};
  const count = await Category.countDocuments({ ...keyword });
  const categories = await Category.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("parentCategory");
  res.json({ data:categories, page, pages: Math.ceil(count / pageSize), count });
});
// GET /api/categories/:id
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    "parentCategory"
  );

  if (category) return res.json(category);
  res.status(404);
  throw new Error("Category not found");
});
// POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, parentCategory } = req.body;

  const category = new Category({ name, slug, description, parentCategory });

  const created = await category.save();
  res.status(201).json(created);
});
// PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Use Object.assign and save to apply and persist updates
  Object.assign(category, req.body);

  const updated = await category.save();
  res.json(updated);
});
// DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const session = await mongoose.startSession(); // Start a transaction session

  try {
    session.startTransaction();

    // category to ensure it exists
    const category = await Category.findById(categoryId).session(session);

    if (!category) {
      await session.abortTransaction();
      res.status(404);
      throw new Error("Category not found");
    }

    //  Handle related Products: Unlink the category from all associated products
    const updateResult = await Product.updateMany(
      { category: categoryId },
      { $set: { category: null } }, // Set the category field to null
      { session: session }
    );

  

    // Delete the Category
    await Category.findByIdAndDelete(categoryId, { session: session });

    // Commit the transaction if both operations succeeded
    await session.commitTransaction();

    res.json({
      message: "Category and its product references successfully removed.",
      productsUpdated: updateResult.modifiedCount,
    });
  } catch (error) {
    // If any operation failed, abort the transaction
    await session.abortTransaction();
    console.error("Transaction failed during category deletion:", error);
    // Re-throw the error or send a 500 status
    if (res.statusCode === 200) {
      // Check if status was not already set (e.g., 404)
      res.status(500);
    }
    throw new Error(`Failed to delete category: ${error.message}`);
  } finally {
    session.endSession(); // End the session
  }
});
export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
