import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Title from "../components/Title";
import API from "../utils/API";
import UserContext from "../context/UserContext";
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "./Profile.css";

function EditProfile() {
  const { user, setUser, loading, setLoading } = useContext(UserContext);
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    API.fetchUser(user)
      .then(profile => {
        setProfile(profile);
      })
      .catch(err => console.log(err));
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
    setUser({ ...profile, [name]: value });
  }

  function handleFormSubmit(event) {
    setLoading(true);
    event.preventDefault();
    API.editUser(profile)
      .then(res => {
        setLoading(false);
        if (res === 0) {
          toast.error("No changes were made to your profile", {
            position: "bottom-right"
          });
        } else if (res === 1) {
          navigate("/profile");
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <Wrapper>
      <Title>Edit Profile</Title>
      <div className="profile-card">
        <div className="profile-header">
          <img
            className="profile-avatar"
            src="/images/default-avatar.jpg"
            alt={`${profile.username}'s avatar`}
          />
          <h2 className="profile-username">@{profile.username}</h2>
        </div>
        <form className="edit-profile-form" onSubmit={handleFormSubmit}>
          <div className="edit-field">
            <label className="edit-label">First Name</label>
            <input
              className="edit-input"
              type="text"
              name="first_name"
              value={profile.first_name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-field">
            <label className="edit-label">Last Name</label>
            <input
              className="edit-input"
              type="text"
              name="last_name"
              value={profile.last_name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-field">
            <label className="edit-label">Email</label>
            <input
              className="edit-input"
              type="text"
              name="email"
              value={profile.email || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-field">
            <label className="edit-label">Zip Code</label>
            <input
              className="edit-input"
              type="text"
              name="zip_code"
              value={profile.zip_code || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-actions">
            {loading ? (
              <Spinner />
            ) : (
              <button type="submit" className="profile-edit-btn">
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
      <ToastContainer autoClose={3000} />
    </Wrapper>
  );
}

export default EditProfile;
