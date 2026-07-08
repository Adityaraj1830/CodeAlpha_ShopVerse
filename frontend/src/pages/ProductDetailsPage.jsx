import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.product);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("shopverseToken");

    if (!token) {
      toast.error("Please login first to add items to cart");
      navigate("/login");
      return;
    }

    try {
      await api.post(
        "/cart",
        {
          productId: product._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product added to cart");
      navigate("/cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <p>Loading product...</p>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <p>{error}</p>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <p>Product not found.</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="product-details-page">
        <div className="product-details-grid">
          <div className="product-details-image-wrapper">
            <img
              src={product.images?.[0]?.url || "https://via.placeholder.com/500"}
              alt={product.name}
              className="product-details-image"
            />
          </div>

          <div className="product-details-content">
            <p className="product-details-category">{product.category}</p>
            <h1 className="product-details-title">{product.name}</h1>
            <p className="product-details-brand">Brand: {product.brand}</p>

            <div className="product-details-price-row">
              <span className="product-details-price">₹{product.price}</span>

              {product.originalPrice > product.price && (
                <span className="product-details-original-price">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <p className="product-details-description">{product.description}</p>

            <p className="product-details-stock">
              Status:{" "}
              <span
                className={
                  product.stock > 0 ? "stock-in" : "stock-out"
                }
              >
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </span>
            </p>

            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-box">
                  <label htmlFor="quantity">Qty:</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(product.stock, Number(e.target.value)))
                      )
                    }
                  />
                </div>

                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailsPage;