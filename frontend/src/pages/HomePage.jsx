import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProductCard from "../components/products/ProductCard";
import api from "../services/api";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/products");
      setProducts(data.products || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <MainLayout>
      <section className="hero-section">
        <h1 className="hero-title">Welcome to ShopVerse</h1>
        <p className="hero-subtitle">
          Discover premium fashion, footwear, electronics and more.
        </p>
      </section>

      <section className="products-section">
        <div className="section-header">
          <h2>Latest Products</h2>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p>{error}</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default HomePage;