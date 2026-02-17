import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../components/Wrapper";
import Title from "../components/Title";
import API from "../utils/API";
import UserContext from "../context/UserContext";
import "./Profile.css";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    API.fetchUser(user)
      .then(profile => {
        setProfile(profile);
        return profile;
      })
      .catch(err => console.log(err));
  }, [user]);

  return (
    <Wrapper>
      <Title>Profile</Title>
      <div className="profile-card">
        <div className="profile-header">
          <img
            className="profile-avatar"
            src="/images/default-avatar.jpg"
            alt={`${profile.username}'s avatar`}
          />
          <h2 className="profile-username">@{profile.username}</h2>
        </div>
        <div className="profile-details">
          <div className="profile-field">
            <span className="profile-label">First Name</span>
            <span className="profile-value">{profile.first_name}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Last Name</span>
            <span className="profile-value">{profile.last_name}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Email</span>
            <span className="profile-value">{profile.email}</span>
          </div>
          <div className="profile-field">
            <span className="profile-label">Zip Code</span>
            <span className="profile-value">{profile.zip_code}</span>
          </div>
        </div>
        <div className="profile-actions">
          <Link to="/editprofile" className="profile-edit-btn">
            Edit Profile
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};
export default Profile;
