import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-center text-lg-start" style={{ backgroundColor: "#FFFDF2", color: "#000000" }}>
      <div className="container p-4">
        <div className="row">
          {/* Brand Intro */}
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">FoodStone</h5>
            <p>
              Welcome to Food Stone – a vibrant hub where restaurants and food lovers connect for endless flavor and convenience.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/AboutUs" className="footer-link">About Us</Link></li>
              <li><Link to="/ContactUs" className="footer-link">Contact</Link></li>
              <li><Link to="/help" className="footer-link">Help</Link></li>
              <li><Link to="/privacypolicy" className="footer-link">PrivacyPolicy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Contact Us</h5>
            <ul className="list-unstyled">
              <li>Email: support@foodstone.com</li>
              <li>Phone: 323-517-4946</li>
              <li>Location: New Delhi, India</li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5 className="text-uppercase">Follow Us</h5>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* Login Section */}
        <div className="text-center mb-3">
          <span className="me-2">Ready to order?</span>
          <Link to="/user/login">
            <button className="login-button">Log in</button>
          </Link>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="text-center p-3" style={{ backgroundColor: "#FFFDF2", color: "#000000" }}>
        © 2025 FoodStone | Made by{" "}
        <a
          className="text-color-3"
          href="https://madhavv.glitch.me/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#000000", textDecoration: "underline" }}
        >
          Madhavv
        </a>
      </div>

      {/* Inline CSS for Social Icons and Login Button */}
      <style>
        {`
          .footer-link {
            color: #000000;
            text-decoration: none;
          }

          .footer-link:hover {
            text-decoration: underline;
            color: #000000;
          }

          .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background-color: #FFFDF2;
            border: 2px solid #000000;
            border-radius: 50%;
            color: #000000;
            transition: all 0.3s ease-in-out;
            text-decoration: none;
          }

          .social-icon:hover {
            background-color: #000000;
            color: #FFFDF2;
            transform: scale(1.1);
          }

          .login-button {
            background-color: #000000;
            color: #FFFDF2;
            padding: 10px 25px;
            border: 2px solid #000000;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease-in-out;
          }

          .login-button:hover {
            background-color: #FFFDF2;
            color: #000000;
            border: 2px solid #000000;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
