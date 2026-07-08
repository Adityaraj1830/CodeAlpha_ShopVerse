import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress) {
    res.status(400);
    throw new Error("Shipping address is required");
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  // Check stock before placing order
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.name}`);
    }
    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
  }

  const itemsPrice = cart.totalPrice;
  const shippingPrice = itemsPrice > 5000 ? 0 : 99;
  const taxPrice = Math.round(itemsPrice * 0.18);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: cart.items.map((item) => ({
      product: item.product._id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    shippingAddress,
    paymentMethod: paymentMethod || "COD",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    orderStatus: "Pending",
  });

  // Reduce stock
  for (const item of cart.items) {
    const product = await Product.findById(item.product._id);
    product.stock -= item.quantity;
    await product.save();
  }

  // Clear cart after order
  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name price images category brand");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Optional: prevent users from opening someone else's order
  if (
    req.user.role !== "admin" &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.status(200).json({
    success: true,
    order,
  });
});