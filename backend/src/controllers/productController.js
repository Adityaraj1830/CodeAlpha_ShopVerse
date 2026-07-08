import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    originalPrice,
    stock,
    brand,
    category,
    featured,
    images,
  } = req.body;

  if (!name || !description || !price || !stock || !category) {
    res.status(400);
    throw new Error("Please fill all required product fields");
  }

  const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    originalPrice: originalPrice || 0,
    discountPercentage:
      originalPrice && Number(originalPrice) > Number(price)
        ? Math.round(
            ((Number(originalPrice) - Number(price)) / Number(originalPrice)) *
              100
          )
        : 0,
    stock,
    brand: brand || "Generic",
    category,
    featured: featured || false,
    images: images || [],
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updateData = { ...req.body };

  if (updateData.name) {
    updateData.slug = updateData.name.toLowerCase().trim().replace(/\s+/g, "-");
  }

  if (
    updateData.originalPrice &&
    updateData.price &&
    Number(updateData.originalPrice) > Number(updateData.price)
  ) {
    updateData.discountPercentage = Math.round(
      ((Number(updateData.originalPrice) - Number(updateData.price)) /
        Number(updateData.originalPrice)) *
        100
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});