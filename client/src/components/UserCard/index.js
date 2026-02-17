import React from "react";
import "./usercard.css";

function UserCard(props) {
  return (
    <div className="user-card">
      <div className="user-card-avatar">
        <img
          alt={props.username}
          src="/images/default-avatar.jpg"
        />
      </div>
      <h3 className="user-card-username">@{props.username}</h3>
      <p className="user-card-name">
        {props.first_name} {props.last_name}
      </p>
    </div>
  );
}

export default UserCard;
