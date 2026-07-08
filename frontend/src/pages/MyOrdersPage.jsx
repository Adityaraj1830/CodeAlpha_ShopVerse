import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("shopverseToken");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.get("/orders/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(data.orders || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (!token) {
    return (
      <MainLayout>
        <div className="orders-page">
          <div className="empty-cart-box">
            <h2>Please login to view your orders</h2>
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
        <p>Loading orders...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="orders-page">
        <h1 className="orders-page-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-cart-box">
            <h2>No orders found</h2>
            <Link to="/" className="cart-action-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-card-top">
                  <div>
                    <p className="order-label">Order ID</p>
                    <h3 className="order-id">{order._id}</h3>
                  </div>

                  <span className="order-status-badge">
                    {order.orderStatus}
                  </span>
                </div>

                <div className="order-meta-grid">
                  <div>
                    <p className="order-label">Placed On</p>
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>

                  <div>
                    <p className="order-label">Payment Method</p>
                    <p>{order.paymentMethod}</p>
                  </div>

                  <div>
                    <p className="order-label">Items Price</p>
                    <p>₹{order.itemsPrice}</p>
                  </div>

                  <div>
                    <p className="order-label">Total Price</p>
                    <p className="order-total-price">₹{order.totalPrice}</p>
                  </div>
                </div>

                <div className="order-card-actions">
                  <button
                    className="view-order-btn"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyOrdersPage;