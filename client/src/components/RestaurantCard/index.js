import React from "react";
import "./restaurantcard.css";
import CardBtn from "../CardBtn";

const FALLBACK_IMG = "/images/food-1.jpg";

function RestaurantCard({ name, image, rating, price, link, display_phone, display_address, distance, opening_hours, handleBtnClick }) {
  const imgSrc = image || FALLBACK_IMG;
  const formattedDistance = distance ? (distance / 1000).toFixed(1) + " km" : "";

  return (
    <div className="restaurant-card">
      <div className="img-container">
        <img alt={name} src={imgSrc} />
      </div>

      <div className="card-buttons">
        <CardBtn
          style={{ opacity: name ? 1 : 0 }}
          onClick={handleBtnClick}
          data-value="back"
        />
        <CardBtn
          style={{ opacity: name ? 1 : 0 }}
          onClick={handleBtnClick}
          data-value="next"
        />
      </div>

      <div className="card-details">
        <h3 className="card-name">
          {link ? <a href={link} target="_blank" rel="noopener noreferrer">{name}</a> : name}
        </h3>
        {rating && <p className="card-cuisine">{rating}</p>}
        {display_address && display_address[0] && (
          <p className="card-address">{display_address[0]}</p>
        )}
        <div className="card-meta">
          {display_phone && <span className="card-phone">{display_phone}</span>}
          {formattedDistance && <span className="card-distance">{formattedDistance}</span>}
        </div>
        {price && <p className="card-diet">{price}</p>}
        {opening_hours && <p className="card-hours">{opening_hours}</p>}
      </div>
    </div>
  );
}

export default RestaurantCard;
