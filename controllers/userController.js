import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");;

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// GET CURRENT USER
 const getCurrentUser = asyncHandler(async (req, res) => {
  // req.userId is guaranteed to exist due to the isAuthenticated middleware
  const userId = req.user._id;
  console.log(userId)
  try {
    const user = await User.findById(userId)

    if (!user) {
      // Should not happen if middleware worked, but good safeguard
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user details error:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve user details." });
  }
});

export { authUser ,getCurrentUser};
