const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const morgan = require("morgan");
const axios = require("axios");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./passport/localStrategy");
//const passport = require('passport')

//local files
// const sequelize = require("./config/database");
const db = require("./models");

//req package to hide environment variables
require("dotenv").config();
// set morgan to log info about our requests for development use.
app.use(morgan("dev"));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(cookieParser());
app.use(
  session({
    key: 'user_sid',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());



// Define API routes here
require("./routes/api/api-routes")(app);
require("./routes/api/users-routes")(app);

app.get("*path", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`🌎 ==> API server now on port ${PORT}!`);
  });
});
