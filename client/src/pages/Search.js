import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
// import "../components/Form/form.css";
import Wrapper from "../components/Wrapper";
import API from "../utils/API";
import SearchBar from "../components/SearchBar";
import RestaurantCard from "../components/RestaurantCard";
import UserContext from "../context/UserContext";
import Spinner from "../components/Spinner";
import { ToastContainer, toast } from "react-toastify";
// import CustomModal from "../components/CustomModal/custommodal";

const FOOD_IMAGES = 7;
const getFoodImage = (id) => `/images/food-${(id % FOOD_IMAGES) + 1}.jpg`;

function Search() {
  const { isLoggedIn, user, loading, setLoading } = useContext(UserContext);

  const [restaurant, setRestaurant] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [location, setInput] = useState("");
  const [restaurantIndex, setRestaurantIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const [type, setType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [diet, setDiet] = useState("");
  const [accessibility, setAccessibility] = useState("");
  const [radius, setRadius] = useState("5000");

  const [favorites, setFavorites] = useState([]);
  const [showFavDrawer, setShowFavDrawer] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadFavorites();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !hasSearched) return;
    setLoading(true);
    loadRestaurants();
  }, [type, cuisine, diet, accessibility, radius]);

  useEffect(() => {
    if (!isLoggedIn || !location) return;
    setHasSearched(true);
    setLoading(true);
    loadRestaurants();
  }, [location]);

  const loadFavorites = () => {
    API.fetchFavorites()
      .then(favs => {
        if (favs) setFavorites(favs);
      })
      .catch(err => console.log(err));
  };

  const deleteFavorite = id => {
    axios.delete(`/api/delete/favorite/${id}`).then(() => {
      setFavorites(favorites.filter(f => f.id !== id));
      toast.info("Removed from favorites", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    });
  };

  const MAX_FAVORITES = 20;

  const addToFavorites = (restaurantData) => {
    if (favorites.length >= MAX_FAVORITES) {
      toast.error(
        `You've reached the maximum limit of ${MAX_FAVORITES} favorites! Remove some to add new ones.`,
        { position: toast.POSITION.BOTTOM_RIGHT }
      );
      return Promise.resolve();
    }

    return axios
      .post("/api/post/favoritestodb", restaurantData)
      .then(res => {
        if (!res.data) {
          toast.error("Psst... This restaurant is already in your favorites!", {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        } else if (res.data.count) {
          toast.warning(
            `You and ${res.data.count} other(s) already have ${res.data.name} added to your favorites!`,
            { position: toast.POSITION.BOTTOM_RIGHT }
          );
        } else if (res.data.favorite) {
          toast.success(`${res.data.favorite.item.name} was added to your favorites`, {
            position: toast.POSITION.BOTTOM_RIGHT
          });
        }
        loadFavorites();
      })
      .catch(err => {
        if (err.response && err.response.status === 400 && err.response.data.error === "limit_reached") {
          toast.error(
            `You've reached the maximum limit of ${MAX_FAVORITES} favorites! Remove some to add new ones.`,
            { position: toast.POSITION.BOTTOM_RIGHT }
          );
        }
      });
  };

  const nextRestaurant = restaurantIndex => {
    // Ensure that the restaurant index stays within our range of restaurants
    if (restaurantIndex < restaurants.length) {
      addToFavorites(restaurants[restaurantIndex - 1])
        .then(() => {
          setRestaurant(restaurants[restaurantIndex]);
          setRestaurantIndex(restaurantIndex);
        });
    } else {
      addToFavorites(restaurants[restaurantIndex - 1]);
    }
  };

  const dislikeRestaurant = restaurantIndex => {
    if (restaurantIndex < restaurants.length) {
      setRestaurant(restaurants[restaurantIndex]);
      setRestaurantIndex(restaurantIndex);
      // console.log(restaurantIndex);
    } else {
        toast.error(
          "There are no more results! Please refine your search.",
          {
            position: toast.POSITION.BOTTOM_RIGHT
          }
        );
    }
  };

  const handleBtnClick = event => {
    // Get the title of the clicked button
    const btnName = event.target.getAttribute("data-value");
    if (btnName === "next") {
      const newRestaurantIndex = restaurantIndex + 1;
      nextRestaurant(newRestaurantIndex, restaurants.length);
      // console.log(restaurantIndex);
    } else {
      const newRestaurantIndex = restaurantIndex + 1;
      dislikeRestaurant(newRestaurantIndex, restaurants.length);
    }
  };

  const loadRestaurants = e => {
    if (e) {
      e.preventDefault();
    }

    if (!location) {
      setLoading(false);
      return;
    }

    setHasSearched(true);
    API.fetchRestaurants({ type, cuisine, location, diet, accessibility, radius })
      .then(r => {
        setLoading(false);
        if (r[0].name !== "undefined") {
          // console.log(r[0].name);
          setRestaurants(r);
          setRestaurant(r[0]);
          setRestaurantIndex(0);
          // console.log(r.length);
          return r;
        }
      })
      .catch(err => {
        console.log(err);
          toast.error(
            "Sorry, there are no results! Please change your search.",
            {
              position: toast.POSITION.BOTTOM_RIGHT
            }
          );
      });
  };

  const cuisineDisabled = type !== "" && type !== "restaurant";

  return (
    <Wrapper>
      <div className="search-layout">
        {/* Left sidebar - Filters */}
        <aside className="filter-sidebar">
          <h3 className="filter-sidebar-title">Filters</h3>

          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select
              className="filter-select"
              name="type"
              value={type}
              onChange={event => setType(event.target.value)}
            >
              <option value="">Select type</option>
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Cafe</option>
              <option value="bar">Bar</option>
              <option value="fast_food">Fast Food</option>
              <option value="pub">Pub</option>
              <option value="ice_cream">Ice Cream</option>
              <option value="food_court">Food Court</option>
              <option value="biergarten">Biergarten</option>
              <option value="taproom">Taproom</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Cuisine</label>
            <select
              className="filter-select"
              name="cuisine"
              value={cuisine}
              onChange={event => setCuisine(event.target.value)}
              disabled={cuisineDisabled}
            >
              <option value="">Select cuisine</option>
              <option value="american">American</option>
              <option value="african">African</option>
              <option value="bbq">BBQ</option>
              <option value="brazilian">Brazilian</option>
              <option value="burger">Burger</option>
              <option value="caribbean">Caribbean</option>
              <option value="chinese">Chinese</option>
              <option value="fish_and_chips">Fish & Chips</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="greek">Greek</option>
              <option value="indian">Indian</option>
              <option value="italian">Italian</option>
              <option value="japanese">Japanese</option>
              <option value="korean">Korean</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="mexican">Mexican</option>
              <option value="middle_eastern">Middle Eastern</option>
              <option value="noodle">Noodle</option>
              <option value="peruvian">Peruvian</option>
              <option value="pizza">Pizza</option>
              <option value="ramen">Ramen</option>
              <option value="seafood">Seafood</option>
              <option value="spanish">Spanish</option>
              <option value="steak_house">Steak</option>
              <option value="sushi">Sushi</option>
              <option value="thai">Thai</option>
              <option value="turkish">Turkish</option>
              <option value="vegan">Vegan</option>
              <option value="vietnamese">Vietnamese</option>
              <option value="wings">Wings</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Diet</label>
            <select
              className="filter-select"
              name="diet"
              value={diet}
              onChange={event => setDiet(event.target.value)}
            >
              <option value="">Select diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="halal">Halal</option>
              <option value="kosher">Kosher</option>
              <option value="gluten_free">Gluten Free</option>
              <option value="organic">Organic</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Accessibility</label>
            <select
              className="filter-select"
              name="accessibility"
              value={accessibility}
              onChange={event => setAccessibility(event.target.value)}
            >
              <option value="">Select option</option>
              <option value="wheelchair">Wheelchair</option>
              <option value="internet_access.free">Free WiFi</option>
              <option value="dogs">Dog Friendly</option>
              <option value="no_smoking">No Smoking</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Radius</label>
            <select
              className="filter-select"
              name="radius"
              value={radius}
              onChange={event => setRadius(event.target.value)}
            >
              <option value="1000">1 km</option>
              <option value="3000">3 km</option>
              <option value="5000">5 km</option>
              <option value="10000">10 km</option>
              <option value="25000">25 km</option>
            </select>
          </div>
        </aside>

        {/* Center - Main content */}
        <main className="search-main">
          <h1 className="header">
            Welcome {user.first_name}!
          </h1>

          <div className="search-main-content">
            <form onSubmit={loadRestaurants}>
              <SearchBar setInput={setInput}></SearchBar>
            </form>

            {!hasSearched ? (
              <div className="welcome-message">
                <h2>Discover your next favorite restaurant</h2>
                <p>Enter a city, state, or zip code above and use the filters on the left to find restaurants near you.</p>
                <p>Swipe right to save to favorites, swipe left to skip!</p>
              </div>
            ) : (
              <div className="card-container">
                {loading ? <Spinner /> :
                <RestaurantCard
                  name={restaurant.name}
                  rating={restaurant.rating}
                  price={restaurant.price}
                  link={restaurant.link}
                  image={restaurant.image}
                  display_phone={restaurant.display_phone}
                  display_address={restaurant.display_address}
                  distance={restaurant.distance}
                  opening_hours={restaurant.opening_hours}
                  handleBtnClick={handleBtnClick}
                />}
              </div>
            )}
          </div>
        </main>

        {/* Right sidebar - Favorites */}
        <aside className="favorites-sidebar">
          <h3 className="filter-sidebar-title">
            Favorites
            <span className="fav-count">{favorites.length}</span>
          </h3>
          <div className="fav-list">
            {favorites.length === 0 ? (
              <p className="fav-empty">Swipe right to add favorites!</p>
            ) : (
              favorites.slice(0, 20).map(fav => (
                <div className="fav-item" key={fav.id}>
                  <img
                    className="fav-item-img"
                    src={fav.image && fav.image.startsWith("/images/") ? fav.image : getFoodImage(fav.id)}
                    alt={fav.name}
                  />
                  <div className="fav-item-info">
                    <span className="fav-item-name">
                      {fav.link ? (
                        <a href={fav.link} target="_blank" rel="noopener noreferrer">{fav.name}</a>
                      ) : fav.name}
                    </span>
                    <span className="fav-item-detail">{fav.rating}</span>
                  </div>
                  <button
                    className="fav-item-remove"
                    onClick={() => deleteFavorite(fav.id)}
                    title="Remove"
                  >
                    &times;
                  </button>
                </div>
              ))
            )}
            {favorites.length > 20 && (
              <p className="fav-overflow">+ {favorites.length - 20} more</p>
            )}
          </div>
        </aside>
      </div>

      {/* Floating favorites button - visible only on mobile/tablet via CSS */}
      <button
        className="fav-toggle-btn"
        onClick={() => setShowFavDrawer(true)}
        aria-label="Open favorites"
      >
        <span role="img" aria-hidden="true">&#9829;</span>
        {favorites.length > 0 && (
          <span className="fav-toggle-badge">{favorites.length}</span>
        )}
      </button>

      {/* Favorites drawer overlay */}
      {showFavDrawer && (
        <div className="fav-drawer-overlay" onClick={() => setShowFavDrawer(false)}>
          <aside className="fav-drawer" onClick={e => e.stopPropagation()}>
            <div className="fav-drawer-header">
              <h3 className="filter-sidebar-title">
                Favorites
                <span className="fav-count">{favorites.length}</span>
              </h3>
              <button
                className="fav-drawer-close"
                onClick={() => setShowFavDrawer(false)}
                aria-label="Close favorites"
              >
                &times;
              </button>
            </div>
            <div className="fav-list">
              {favorites.length === 0 ? (
                <p className="fav-empty">Swipe right to add favorites!</p>
              ) : (
                favorites.slice(0, 20).map(fav => (
                  <div className="fav-item" key={fav.id}>
                    <img
                      className="fav-item-img"
                      src={fav.image && fav.image.startsWith("/images/") ? fav.image : getFoodImage(fav.id)}
                      alt={fav.name}
                    />
                    <div className="fav-item-info">
                      <span className="fav-item-name">
                        {fav.link ? (
                          <a href={fav.link} target="_blank" rel="noopener noreferrer">{fav.name}</a>
                        ) : fav.name}
                      </span>
                      <span className="fav-item-detail">{fav.rating}</span>
                    </div>
                    <button
                      className="fav-item-remove"
                      onClick={() => deleteFavorite(fav.id)}
                      title="Remove"
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
              {favorites.length > 20 && (
                <p className="fav-overflow">+ {favorites.length - 20} more</p>
              )}
            </div>
          </aside>
        </div>
      )}

      <ToastContainer
        autoClose={3000}/>
    </Wrapper>
  );
}

export default Search;
