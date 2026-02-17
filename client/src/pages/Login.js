import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Title from "../components/Title";
import API from "../utils/API";
import UserContext from '../context/UserContext';
import Spinner from '../components/Spinner';
import { ToastContainer, toast } from "react-toastify";
import "./AuthForm.css";

const Login = () => {
  const [formLogin, setFormLogin] = useState({});
  const { setUser, setIsLoggedIn, loading, setLoading } = useContext(UserContext);
  const navigate = useNavigate();

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormLogin({ ...formLogin, [name]: value });
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (formLogin.username && formLogin.password) {
      setLoading(true);
      API.getOneUser({
        username: formLogin.username,
        password: formLogin.password
      })
        .then(res => {
          setLoading(false);
          if (res.data.username) {
            setUser(res.data);
            setIsLoggedIn(true);
            navigate("/search");
          } else {
            toast.error(
              "Sorry, no user found with that username. Check your credentials or signup.",
              { position: "bottom-right" }
            );
          }
        })
        .catch(err => {
          setLoading(false);
          if (err.response && err.response.status === 401) {
            toast.error("Incorrect credential. Please try again.", {
              position: "bottom-right"
            });
          }
        });
    } else {
      toast.error("Please enter your username and password", {
        position: "bottom-right"
      });
    }
  }

  return (
    <Wrapper>
      <Title>Find your perfect restaurant match!</Title>
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to your account</p>
        </div>
        <form className="auth-form" onSubmit={handleFormSubmit}>
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <input
              className="auth-input"
              type="text"
              name="username"
              placeholder="Enter your username"
              onChange={handleInputChange}
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleInputChange}
            />
          </div>
          <div className="auth-actions">
            {loading ? (
              <Spinner />
            ) : (
              <button type="submit" className="auth-btn">Log in</button>
            )}
          </div>
          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
      <ToastContainer autoClose={3000} />
    </Wrapper>
  );
};

export default Login;
