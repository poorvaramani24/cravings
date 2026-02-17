import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Title from "../components/Title";
import API from "../utils/API";
import UserContext from "../context/UserContext";
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "./AuthForm.css";

function Signup() {
  const { loading, setLoading } = useContext(UserContext);
  const [formObject, setFormObject] = useState({});
  const navigate = useNavigate();

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({ ...formObject, [name]: value });
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (formObject.inputUsername && formObject.inputPassword) {
      setLoading(true);
      API.saveUser({
        first_name: formObject.inputFirstName,
        last_name: formObject.inputLastName,
        username: formObject.inputUsername,
        email: formObject.inputEmail,
        zip_code: formObject.inputZipCode,
        password: formObject.inputPassword
      })
        .then(res => {
          setLoading(false);
          if (res.data.username) {
            navigate('/login');
          } else if (res.data.created === false) {
            toast.error("There was a validation error - Please choose another username", {
              position: "bottom-right"
            });
          } else {
            toast.error("There was an error during signup", {
              position: "bottom-right"
            });
          }
        })
        .catch(err => console.log(err));
    } else {
      setLoading(false);
      toast.error("Please fill out all fields to signup", {
        position: "bottom-right"
      });
    }
  }

  return (
    <Wrapper>
      <Title>Create your account</Title>
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Join Cravings</h2>
          <p className="auth-subtitle">Sign up to discover restaurants</p>
        </div>
        <form className="auth-form" onSubmit={handleFormSubmit}>
          <div className="auth-field">
            <label className="auth-label">First Name</label>
            <input className="auth-input" type="text" name="inputFirstName" placeholder="First Name" onChange={handleInputChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Last Name</label>
            <input className="auth-input" type="text" name="inputLastName" placeholder="Last Name" onChange={handleInputChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Username</label>
            <input className="auth-input" type="text" name="inputUsername" placeholder="Username" onChange={handleInputChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input className="auth-input" type="email" name="inputEmail" placeholder="Email" onChange={handleInputChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Zip Code</label>
            <input className="auth-input" type="text" name="inputZipCode" placeholder="Zip Code" onChange={handleInputChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" name="inputPassword" placeholder="Password" onChange={handleInputChange} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Confirm Password</label>
            <input className="auth-input" type="password" name="inputConfirmPassword" placeholder="Confirm Password" onChange={handleInputChange} />
          </div>
          <div className="auth-actions">
            {loading ? (
              <Spinner />
            ) : (
              <button type="submit" className="auth-btn">Sign Up</button>
            )}
          </div>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </Wrapper>
  );
}

export default Signup;
