const express = require("express"); // express app
const router = express.Router(); // router logic

// import the controllers to route
const tripsController = require("../controllers/trips");

// define route for trips endpoints
router
    .route("/trips")
    .get(tripsController.tripsList) // get all trips
    .post(tripsController.tripsAddTrip); // post a new trip
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(tripsController.tripsUpdateTrip); // update a trip by code

module.exports = router;