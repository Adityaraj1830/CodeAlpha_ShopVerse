import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          ShopVerse
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/my-orders">My Orders</Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;