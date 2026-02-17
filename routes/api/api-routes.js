const axios = require("axios");
var db = require("../../models");
const isAuthenticated = require("../../passport/middleware/isAuthenticated");
const checkOrCreate = require('../helpers');
//const Sequelize = require('../../models/index')
const Sequelize = require('sequelize')

//michelle's change

module.exports = function(app, user) {
  app.get("/api/restaurants", (req, res) => {
    const type = req.query.type || "restaurant";
    const cuisine = req.query.cuisine || "";
    const location = req.query.location || "Chicago";
    const diet = req.query.diet || "";
    const accessibility = req.query.accessibility || "";
    const radius = parseInt(req.query.radius) || 5000;
    const apiKey = process.env.GEOAPIFY_API_KEY;

    // First geocode the location, then search for restaurants nearby
    axios
      .get("https://api.geoapify.com/v1/geocode/search", {
        params: { text: location, apiKey }
      })
      .then(geoRes => {
        if (!geoRes.data.features || geoRes.data.features.length === 0) {
          return res.status(404).json({ error: "Location not found" });
        }
        const { lat, lon } = geoRes.data.features[0].properties;

        // Build category: catering.restaurant.italian, catering.cafe, etc.
        let categories = `catering.${type}`;
        if (cuisine && type === "restaurant") {
          categories = `catering.restaurant.${cuisine}`;
        }

        const params = {
          categories,
          filter: `circle:${lon},${lat},${radius}`,
          limit: 50,
          apiKey
        };

        // Combine diet and accessibility into conditions
        const conditions = [diet, accessibility].filter(Boolean).join(",");
        if (conditions) {
          params.conditions = conditions;
        }

        return axios.get("https://api.geoapify.com/v2/places", { params });
      })
      .then(response => {
        if (!response || !response.data) return;
        console.log("Geoapify response received:", response.data.features.length, "results");
        const FOOD_IMAGES = 7;
        const businesses = response.data.features.map((feature, idx) => {
          const p = feature.properties;
          const cuisine = p.catering && p.catering.cuisine ? p.catering.cuisine.replace(/;/g, ", ") : "";
          const diet = p.catering && p.catering.diet ? Object.keys(p.catering.diet).join(", ") : "";
          const imageNum = (idx % FOOD_IMAGES) + 1;
          return {
            name: p.name || "Unknown",
            rating: cuisine || "Restaurant",
            price: diet || "",
            image_url: `/images/food-${imageNum}.jpg`,
            url: p.website || "",
            is_closed: false,
            id: p.place_id,
            phone: p.contact ? p.contact.phone || "" : "",
            location: { display_address: [p.formatted || ""] },
            categories: p.categories || [],
            coordinates: { latitude: p.lat || 0, longitude: p.lon || 0 },
            distance: p.distance || 0,
            opening_hours: p.opening_hours || ""
          };
        });
        res.json({ businesses });
      })
      .catch(e => {
        console.log("Geoapify error:", e.response ? JSON.stringify(e.response.data) : e.message);
        res.status(500).json({ error: e.message });
      });
  });

  // Getting Team details from db
  app.get("/api/get/otheruserprofilefromdb", function(req, res) {
    db.Users.findAll({}).then(function(data) {
      //   console.log(data);
      res.json(data);
    });
  });

  // getting user profile details from db
  app.get("/api/get/userprofile/:username", function(req, res) {
    db.Users.findOne({
      where: {
        //needs updation with implementation of authentication
        username: req.params.username
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  //get favorites list from db
  // app.get("/api/get/favoritesfromdb", function(req, res) {
  //   db.Favorites.findAll({}).then(function(data) {
  //     res.json(data);
  //   });
  // });

  // Deb changes:

  app.get("/api/get/favoritesfromdb", function(req, res) {
    const userID = req.session.passport.user.id;
    db.Favorites.findAll({
      where: {
        UserId: userID
      }
    }).then(function(data) {
      res.json(data);
    });
  });

  //add to favourites on swipe right
  app.post("/api/post/favoritestodb", (req, res) => {
    console.log(req.session.passport.user.id)
    const restName = req.body.name
    const loggedIn = req.session.passport.user.id
    const MAX_FAVORITES = 20;

    // Check if user has reached the favorites limit
    db.Favorites.count({ where: { UserId: loggedIn } }).then(count => {
      if (count >= MAX_FAVORITES) {
        return res.status(400).json({ error: "limit_reached", message: `Maximum of ${MAX_FAVORITES} favorites reached.` });
      }

    //  FUNCTION TO CHECK IF THERE IS ALREADY AN ENTRY IN DB ASSOCIATED WITH LOGGED IN USER'S ID

    checkOrCreate(db.Favorites, Sequelize.and
      ([
        {
          name: restName,
          UserID: loggedIn
        }
      ])
      
      , {
        name: req.body.name,
        rating: req.body.rating,
        price: req.body.price,
        image: req.body.image,
        link: req.body.link,
        is_closed: req.body.is_closed,
        restaurant_id: req.body.restaurant_id,
        display_phone: req.body.display_phone,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        distance: req.body.distance,
        UserId: req.session.passport.user.id
      })
      .then(function (favorite) {
        if (!favorite.created) {
          //console.log('if not favorite created');
          const restName = favorite.found.name
          db.Favorites.findAndCountAll({
            where : { name: restName }
          }).then(count => {;
            //console.log(count.count)
            if (count.count === 1) {
              //console.log('only one person saved to favorites')
              return res.json(null);
            } else if (count.count > 1) {
              //console.log('more than one person saved to db')
              const others = count.count - 1;
              return res.json({ count: others, name: restName });
            }
            
          })
          //return res.json(favorite);
        } else if (favorite) {
          db.Feeds.create({
            user_id: req.session.passport.user.id,
            username: req.session.passport.user.username,
            activity_type: "added to favourites",
            restaurant_name: req.body.name,
            image: req.body.image,
            link: req.body.link
          }).then(feeds => {
            // console.log('added to Feeds')
            return res.json({ favorite: favorite, feeds: feeds });
          });
        }
      });
    }); // end count check
  });

  app.delete("/api/delete/favorite/:id", (req, res) => {
    // console.log(req.params.id);
    db.Favorites.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(data) {
      db.Favorites.destroy({
        where: {
          id: data.id
        }
      }).then(function(response) {
        db.Feeds.create({
          user_id: req.session.passport.user.id,
          username: req.session.passport.user.username,
          activity_type: "removed from favourites",
          restaurant_name: data.name,
          image: req.body.image,
          link: req.body.link
                }).then(feeds => {
          res.json({ response: response, feeds: feeds });
        });
      });
    });
  });

  app.get("/api/get/feedsfromdb", function(req, res) {
    db.Feeds.findAll({ order: [["id", "DESC"]], limit: 10 }).then(function(
      data
    ) {
      res.json(data);
    });
  });

  app.put("/api/put/userprofile/:id", (req, res) => {
    // console.log("req body");
    // console.log(req.body);
    db.Users.update(req.body, {
      where: { id: req.params.id }
      // returning: true
    }).then(function(response) {
      // console.log("updated user");
      // console.log(response);
      res.json(response);
    }),
      function(err) {
        console.log(err);
      };
  });
  };
  
