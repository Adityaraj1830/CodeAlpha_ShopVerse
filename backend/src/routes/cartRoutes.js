import express from "express";
import {
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeFromCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getMyCart);
router.put("/", protect, updateCartItemQuantity);
router.delete("/:productId", protect, removeFromCart);

export default router;