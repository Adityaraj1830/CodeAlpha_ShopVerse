import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const recalculateCart = (cart) => {
  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
};

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error("Product ID is required");
  }

  const qty = Number(quantity) || 1;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < qty) {
    res.status(400);
    throw new Error("Requested quantity exceeds available stock");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    const newQuantity = cart.items[existingItemIndex].quantity + qty;

    if (newQuantity > product.stock) {
      res.status(400);
      throw new Error("Cannot add more than available stock");
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || "",
      price: product.price,
      quantity: qty,
      stock: product.stock,
    });
  }

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart,
  });
});

export const getMyCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price images stock category brand"
  );

  if (!cart) {
    cart = {
      user: req.user._id,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    res.status(400);
    throw new Error("Product ID and quantity are required");
  }

  const qty = Number(quantity);

  if (qty < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product no longer exists");
  }

  if (qty > product.stock) {
    res.status(400);
    throw new Error("Requested quantity exceeds available stock");
  }

  cart.items[itemIndex].quantity = qty;
  cart.items[itemIndex].stock = product.stock;

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart,
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const existingLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  if (cart.items.length === existingLength) {
    res.status(404);
    throw new Error("Product not found in cart");
  }

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product removed from cart",
    cart,
  });
});