const express = require("express");
const path = require("path");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./passport/localStrategy");

require("dotenv").config();

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(cookieParser());
app.use(
  session({
    key: "user_sid",
    secret: process.env.SECRET || "test-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/api/api-routes")(app);
require("./routes/api/users-routes")(app);

app.get("*path", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

module.exports = app;
