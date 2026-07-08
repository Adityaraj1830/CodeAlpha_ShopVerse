import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import api from "../services/api";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const token = localStorage.getItem("shopverseToken");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.get(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(data.order);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!token) {
    return (
      <MainLayout>
        <div className="order-details-page">
          <div className="empty-cart-box">
            <h2>Please login to view order details</h2>
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
        <p>Loading order details...</p>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="order-details-page">
          <div className="empty-cart-box">
            <h2>Order not found</h2>
            <Link to="/my-orders" className="cart-action-btn">
              Back to My Orders
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="order-details-page">
        <h1 className="orders-page-title">Order Details</h1>

        <div className="order-details-layout">
          <div className="order-details-left">
            <div className="order-details-card">
              <h2 className="order-section-title">Order Summary</h2>

              <div className="order-summary-grid">
                <div>
                  <p className="order-label">Order ID</p>
                  <p className="order-id">{order._id}</p>
                </div>

                <div>
                  <p className="order-label">Status</p>
                  <p className="order-status-text">{order.orderStatus}</p>
                </div>

                <div>
                  <p className="order-label">Payment Method</p>
                  <p>{order.paymentMethod}</p>
                </div>

                <div>
                  <p className="order-label">Placed On</p>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="order-details-card">
              <h2 className="order-section-title">Shipping Address</h2>

              <div className="shipping-address-box">
                <p><strong>{order.shippingAddress?.fullName}</strong></p>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.addressLine}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p>
                  {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </p>
              </div>
            </div>

            <div className="order-details-card">
              <h2 className="order-section-title">Ordered Items</h2>

              <div className="ordered-items-list">
                {order.orderItems?.map((item, index) => (
                  <div className="ordered-item-card" key={index}>
                    <img
                      src={item.image || "https://via.placeholder.com/120"}
                      alt={item.name}
                      className="ordered-item-image"
                    />

                    <div className="ordered-item-info">
                      <h3>{item.name}</h3>
                      <p>Price: ₹{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>

                    <div className="ordered-item-total">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-details-right">
            <div className="order-details-card order-price-card">
              <h2 className="order-section-title">Price Details</h2>

              <div className="summary-row">
                <span>Items Price</span>
                <span>₹{order.itemsPrice}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>₹{order.shippingPrice}</span>
              </div>

              <div className="summary-row">
                <span>Tax</span>
                <span>₹{order.taxPrice}</span>
              </div>

              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{order.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderDetailsPage;