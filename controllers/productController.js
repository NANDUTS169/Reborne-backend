import asyncHandler from "express-async-handler";
import { Product } from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
// Upload file to Cloudinary
const uploadToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "products",
  });
  fs.unlinkSync(filePath); // delete local temp file
  return result.secure_url;
};

// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: "i" } }
    : {};
  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("category");
  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (product) return res.json(product);
  res.status(404);
  throw new Error("Product not found");
});

// POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      brand,
      category,
      price,
      countInStock,
      colors,
      sizes,
    } = req.body;

    // Validate required fields
    if (!name || !slug || !category || !price) {
      return res.status(400).json({
        message: "name, slug, category, and price are required.",
      });
    }

    let images = [];

    // Upload images if files exist
    if (req.files && req.files.length > 0) {
      try {
        const uploads = await Promise.all(
          req.files.map(async (file) => {
            try {
              const url = await uploadToCloudinary(file.path);
              return { url, alt: file.originalname };
            } catch (cloudErr) {
              console.error("Cloudinary Upload Error:", cloudErr);
              throw new Error("Failed to upload images to Cloudinary");
            }
          })
        );

        images = uploads;
      } catch (imgErr) {
        return res.status(500).json({
          message: "Image upload failed",
          error: imgErr.message,
        });
      }
    }

    // Create product object
    const product = new Product({
      name,
      slug,
      description,
      brand,
      category,
      price,
      countInStock,
      images,
      colors,
      sizes,
    });

    // Save the product
    const created = await product.save();
    res.status(201).json(created);
  } catch (err) {
    console.error("Create Product Error:", err);

    // Mongoose duplicate key (slug unique check)
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate field value entered",
        field: err.keyValue,
      });
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    // Fallback 500
    res.status(500).json({
      message: "Server error while creating product",
      error: err.message,
    });
  }
});

// PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  Object.assign(product, req.body);
  // upload new images if sent
  if (req.files && req.files.length > 0) {
    const uploads = await Promise.all(
      req.files.map(async (file) => {
        const url = await uploadToCloudinary(file.path);
        return { url, alt: file.originalname };
      })
    );
    product.images.push(...uploads); // append new images
  }
  const updated = await product.save();
  res.json(updated);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (deleted) {
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
