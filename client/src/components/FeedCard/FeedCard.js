import React from "react";
import "./feedcard.css";

function FeedCard(props) {
  return (
    <div className="feed-card">
      <div className="feed-card-header">
        <img
          className="feed-avatar"
          src="/images/default-avatar.jpg"
          alt={`${props.username}'s avatar`}
        />
        <div className="feed-card-info">
          <p className="feed-card-user">
            <strong>{props.username}</strong> {props.activity_type}
          </p>
          <a className="feed-card-restaurant" href={props.link}>
            {props.restaurant_name}
          </a>
        </div>
      </div>
      {props.image && (
        <img className="feed-card-image" alt={props.restaurant_name} src={props.image} />
      )}
    </div>
  );
}

export default FeedCard;
