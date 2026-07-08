import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-wrapper">
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
          alt={product.name}
          className="product-image"
        />
      </Link>

      <div className="product-card-content">
        <h3 className="product-title">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>

        <p className="product-brand">{product.brand}</p>
        <p className="product-category">{product.category}</p>

        <div className="product-price-row">
          <span className="product-price">₹{product.price}</span>

          {product.originalPrice > product.price && (
            <span className="product-original-price">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        <Link to={`/product/${product._id}`} className="view-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;