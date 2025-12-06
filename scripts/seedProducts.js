// backend/scripts/seedProducts.js
import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import User from "../models/User.js";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
const categoryData = [
  { name: "Kids", slug: "kids", description: "" },
  { name: "Women", slug: "women", description: "" },
  { name: "Men", slug: "men", description: "" },
  { name: "Sportswear", slug: "sportswear", description: "" },
  { name: "Footwear", slug: "footwear", description: "" },
  { name: "Accessories", slug: "accessories", description: "" },
];
const sampleProducts = [
  {
    name: "Kids Summer Cotton Shorts",
    slug: "kids-cotton-shorts",
    category: "69329337df846d35242bac19",
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    colors: ["blue", "yellow"],
    images: [
      {
        url: "https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg",
        alt: "Kids cotton shorts",
      },
    ],
    price: 399,
    countInStock: 25,
    description: "Lightweight cotton shorts perfect for active kids.",
  },
  {
    name: "Kids Printed T-Shirt",
    slug: "kids-printed-tee",
    category: "69329337df846d35242bac19",
    sizes: ["2Y", "4Y", "6Y"],
    colors: ["white", "red"],
    images: [
      {
        url: "https://images.pexels.com/photos/1648373/pexels-photo-1648373.jpeg",
        alt: "Kids printed t-shirt",
      },
    ],
    price: 299,
    countInStock: 40,
    description: "Fun printed t-shirt made from soft breathable cotton.",
  },
  {
    name: "Women's Oversized T-Shirt",
    slug: "women-oversized-tee",
    category: "69329337df846d35242bac1a",
    sizes: ["S", "M", "L"],
    colors: ["beige", "white"],
    images: [
      {
        url: "https://images.pexels.com/photos/6311393/pexels-photo-6311393.jpeg",
        alt: "Women's oversized t-shirt",
      },
    ],
    price: 699,
    countInStock: 30,
    description: "Trendy oversized tee with a relaxed streetwear fit.",
  },
  {
    name: "Women's Slim Fit Jeans",
    slug: "women-slim-jeans",
    category: "69329337df846d35242bac1a",
    sizes: ["28", "30", "32", "34"],
    colors: ["blue"],
    images: [
      {
        url: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
        alt: "Women's slim fit jeans",
      },
    ],
    price: 1299,
    countInStock: 18,
    description:
      "Stretchable slim-fit jeans for a flattering modern silhouette.",
  },
  {
    name: "Women's Floral Dress",
    slug: "women-floral-dress",
    category: "69329337df846d35242bac1a",
    sizes: ["XS", "S", "M", "L"],
    colors: ["pink", "white"],
    images: [
      {
        url: "https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg",
        alt: "Women's floral dress",
      },
    ],
    price: 1499,
    countInStock: 20,
    description: "Elegant floral printed dress with lightweight fabric.",
  },
  {
    name: "Women's Casual Hoodie",
    slug: "women-casual-hoodie",
    category: "69329337df846d35242bac1a",
    sizes: ["S", "M", "L", "XL"],
    colors: ["black", "gray"],
    images: [
      {
        url: "https://images.pexels.com/photos/6311391/pexels-photo-6311391.jpeg",
        alt: "Women's casual hoodie",
      },
    ],
    price: 1099,
    countInStock: 28,
    description: "Soft fleece hoodie designed for comfort and style.",
  },
  {
    name: "Women's Running Shoes",
    slug: "women-running-shoes",
    category: "69329337df846d35242bac1a",
    sizes: ["6", "7", "8", "9"],
    colors: ["black", "white"],
    images: [
      {
        url: "https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg",
        alt: "Women's running shoes",
      },
    ],
    price: 2199,
    countInStock: 15,
    description: "Breathable running shoes with cushioned support.",
  },
  {
    name: "Men's Formal Shirt",
    slug: "men-formal-shirt",
    category: "69329337df846d35242bac1b",
    sizes: ["M", "L", "XL"],
    colors: ["white", "light blue"],
    images: [
      {
        url: "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg",
        alt: "Men formal shirt",
      },
    ],
    price: 899,
    countInStock: 32,
    description: "Premium cotton formal shirt suitable for office wear.",
  },
  {
    name: "Men's Track Pants",
    slug: "men-track-pants",
    category: "69329337df846d35242bac1c",
    sizes: ["S", "M", "L"],
    colors: ["black", "gray"],
    images: [
      {
        url: "https://images.pexels.com/photos/6311668/pexels-photo-6311668.jpeg",
        alt: "Men track pants",
      },
    ],
    price: 799,
    countInStock: 24,
    description: "Comfort-fit track pants suitable for all sports activities.",
  },
  {
    name: "Unisex Sports T-Shirt",
    slug: "unisex-sports-tee",
    category: "69329337df846d35242bac1c",
    sizes: ["S", "M", "L"],
    colors: ["blue", "black"],
    images: [
      {
        url: "https://images.pexels.com/photos/4720235/pexels-photo-4720235.jpeg",
        alt: "Sports t-shirt",
      },
    ],
    price: 599,
    countInStock: 33,
    description: "Moisture-wicking performance t-shirt for training sessions.",
  },
  {
    name: "Men's Sport Shoes",
    slug: "men-sport-shoes",
    category: "69329337df846d35242bac1c",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["black", "red"],
    images: [
      {
        url: "https://images.pexels.com/photos/2529144/pexels-photo-2529144.jpeg",
        alt: "Men sport shoes",
      },
    ],
    price: 2099,
    countInStock: 19,
    description: "Durable sport shoes with strong grip and breathable mesh.",
  },
  {
    name: "Kids Sports Shoes",
    slug: "kids-sports-shoes",
    category: "69329337df846d35242bac19",
    sizes: ["2Y", "4Y", "6Y"],
    colors: ["blue", "green"],
    images: [
      {
        url: "https://images.pexels.com/photos/1254502/pexels-photo-1254502.jpeg",
        alt: "Kids sports shoes",
      },
    ],
    price: 899,
    countInStock: 17,
    description: "Comfortable lightweight sports shoes for kids.",
  },
  {
    name: "Women's Canvas Sneakers",
    slug: "women-canvas-sneakers",
    category: "69329337df846d35242bac1d",
    sizes: ["6", "7", "8", "9"],
    colors: ["white"],
    images: [
      {
        url: "https://images.pexels.com/photos/2529143/pexels-photo-2529143.jpeg",
        alt: "Women's canvas sneakers",
      },
    ],
    price: 1499,
    countInStock: 20,
    description: "Classic canvas sneakers perfect for daily casual wear.",
  },
  {
    name: "Men's Leather Belt",
    slug: "men-leather-belt",
    category: "69329337df846d35242bac1e",
    colors: ["brown", "black"],
    sizes: [],
    images: [
      {
        url: "https://images.pexels.com/photos/6311395/pexels-photo-6311395.jpeg",
        alt: "Men leather belt",
      },
    ],
    price: 499,
    countInStock: 45,
    description: "Durable pure leather belt with a sleek metal buckle.",
  },
  {
    name: "Women's Shoulder Bag",
    slug: "women-shoulder-bag",
    category: "69329337df846d35242bac1e",
    colors: ["brown", "cream"],
    sizes: [],
    images: [
      {
        url: "https://images.pexels.com/photos/167703/pexels-photo-167703.jpeg",
        alt: "Women's handbag",
      },
    ],
    price: 1599,
    countInStock: 16,
    description: "Elegant shoulder bag with multiple compartments.",
  },
  {
    name: "Men's Wrist Watch",
    slug: "men-wrist-watch",
    category: "69329337df846d35242bac1e",
    colors: ["black"],
    sizes: [],
    images: [
      {
        url: "https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg",
        alt: "Men wrist watch",
      },
    ],
    price: 1999,
    countInStock: 12,
    description: "Stylish analog wristwatch with a premium leather strap.",
  },
  {
    name: "Women's Sunglasses",
    slug: "women-sunglasses",
    category: "69329337df846d35242bac1e",
    colors: ["black", "gold"],
    sizes: [],
    images: [
      {
        url: "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg",
        alt: "Women sunglasses",
      },
    ],
    price: 899,
    countInStock: 28,
    description: "UV-protected sunglasses with a chic modern frame.",
  },
];

const importData = async () => {
  try {
    await connectDB();

    // wipe existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // create admin user (password will be hashed by the model)
    await User.create({
      name: "Admin",
      email: "admin@reborne.local",
      password: "admin123",
      isAdmin: true,
    });

    // insert sample
    // await Category.insertMany(categoryData);
    // await Product.insertMany(sampleProducts);
    // console.log(await  Category.find())
    console.log("Data Imported");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

importData();
