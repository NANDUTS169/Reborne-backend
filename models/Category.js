import mongoose from "mongoose";
// --- Category Schema and Model ---
const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);
export const Category = mongoose.model("Category", categorySchema);
