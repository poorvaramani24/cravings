import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import UserContext from "../../context/UserContext";

function Navbar() {
  const { isLoggedIn } = useContext(UserContext);
  const collapseRef = useRef(null);
  const togglerRef = useRef(null);

  function collapseNav() {
    const el = collapseRef.current;
    if (el && el.classList.contains("show")) {
      el.classList.remove("show");
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">
        <img
          src="https://github.com/Swipable/swipable/blob/development/client/src/components/Navbar/logo.png?raw=true"
          width="130"
          alt="cravings"
        />
      </a>

      <button
        className="navbar-toggler"
        type="button"
        ref={togglerRef}
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent" ref={collapseRef}>
        <ul className="navbar-nav me-auto">
          {isLoggedIn === true ? (
            <>
              <li className="nav-item active">
                <Link to="/search" className="nav-link" onClick={collapseNav}>
                  Search
                </Link>
              </li>
              <li className="nav-item active">
                <Link to="/profile" className="nav-link" onClick={collapseNav}>
                  Profile
                </Link>
              </li>
              <li className="nav-item active">
                <Link to="/newsfeed" className="nav-link" onClick={collapseNav}>
                  Newsfeed
                </Link>
              </li>
              <li className="nav-item active">
                <Link to="/team" className="nav-link" onClick={collapseNav}>
                  Team
                </Link>
              </li>
            </>
          ) : null}
        </ul>

        <form className="form-inline my-2 my-lg-0">
          {isLoggedIn === true ? (
            <Link to="/logout" onClick={collapseNav}>
              <button className="btn btn-outline-light my-2 my-sm-0">
                Logout
              </button>
            </Link>
          ) : (
            <>
              <Link to="/signup" onClick={collapseNav}>
                <button className="btn btn-outline-light my-2 my-sm-0">
                  Sign Up
                </button>
              </Link>
              <Link to="/login" onClick={collapseNav}>
                <button className="btn btn-outline-light my-2 my-sm-0">
                  Login
                </button>
              </Link>
            </>
          )}
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
