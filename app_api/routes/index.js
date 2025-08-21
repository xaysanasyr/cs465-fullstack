const express = require("express"); // express app
const router = express.Router(); // router logic
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// import the controllers to route
const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");

router.route("/register").post(authController.register); // user registration route
router.route("/login").post(authController.login); // user login route

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
  // console.log('In Middleware');
  const authHeader = req.headers['authorization']; // "Bearer <token>"

  if (!authHeader) {
    console.log('Auth Header Required but NOT PRESENT!');
    return res.sendStatus(401); // Unauthorized
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    console.log('Not enough tokens in Auth Header: ' + parts.length);
    return res.sendStatus(401);
  }

  const [scheme, token] = parts;
  if (scheme !== 'Bearer') {
    console.log('Authorization scheme must be Bearer');
    return res.sendStatus(401);
  }

  if (!token) {
    console.log('Null/empty Bearer Token');
    return res.sendStatus(401);
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = verified; // decoded payload (e.g., _id, email, name)
    return next();
  } catch (err) {
    console.log('Token Validation Error!', err.message);
    return res.sendStatus(401);
  }
}

module.exports = authenticateJWT;

// define route for trips endpoints
router
    .route("/trips")
    .get(tripsController.tripsList) // get all trips
    .post(authenticateJWT, tripsController.tripsAddTrip); // post a new trip
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip); // update a trip by code

module.exports = router;