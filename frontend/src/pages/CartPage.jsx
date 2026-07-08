import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

const CartPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("shopverseToken");

  const fetchCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(data.cart || { items: [], totalItems: 0, totalPrice: 0 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      const { data } = await api.put(
        "/cart",
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCart(data.cart);
      toast.success("Cart updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cart");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(data.cart);
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  if (!token) {
    return (
      <MainLayout>
        <div className="cart-page">
          <div className="empty-cart-box">
            <h2>Please login to view your cart</h2>
            <Link to="/login" className="cart-action-btn">
              Go to Login
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <p>Loading cart...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="cart-page">
        <h1 className="cart-page-title">Your Cart</h1>

        {cart.items.length === 0 ? (
          <div className="empty-cart-box">
            <h2>Your cart is empty</h2>
            <Link to="/" className="cart-action-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              {cart.items.map((item) => (
                <div className="cart-item-card" key={item.product._id || item.product}>
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>Price: ₹{item.price}</p>
                    <p>Available Stock: {item.stock}</p>

                    <div className="cart-item-actions">
                      <div className="cart-qty-box">
                        <label>Qty:</label>
                        <input
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.product._id || item.product,
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>

                      <button
                        className="remove-cart-btn"
                        onClick={() =>
                          handleRemoveItem(item.product._id || item.product)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-card">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Total Items</span>
                <span>{cart.totalItems}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice}</span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;