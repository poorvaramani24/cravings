import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo from "./logo.png";
import UserContext from "../../context/UserContext";

function Navbar() {
  const { isLoggedIn } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen(prev => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">
        <img
          src={logo}
          width="130"
          alt="cravings"
        />
      </a>

      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleMenu}
        aria-controls="navbarSupportedContent"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarSupportedContent">
        <ul className="navbar-nav me-auto">
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/search" className="nav-link" onClick={closeMenu}>Search</Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={closeMenu}>Profile</Link>
              </li>
              <li className="nav-item">
                <Link to="/newsfeed" className="nav-link" onClick={closeMenu}>Newsfeed</Link>
              </li>
              <li className="nav-item">
                <Link to="/team" className="nav-link" onClick={closeMenu}>Team</Link>
              </li>
            </>
          ) : null}
        </ul>

        <div className="nav-auth-buttons">
          {isLoggedIn ? (
            <Link to="/logout" onClick={closeMenu}>
              <button className="btn btn-outline-light my-2 my-sm-0">Logout</button>
            </Link>
          ) : (
            <>
              <Link to="/signup" onClick={closeMenu}>
                <button className="btn btn-outline-light my-2 my-sm-0">Sign Up</button>
              </Link>
              <Link to="/login" onClick={closeMenu}>
                <button className="btn btn-outline-light my-2 my-sm-0">Login</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
