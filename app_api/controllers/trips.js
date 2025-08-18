const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

const tripsList = async (req, res) => {
    try {
        const trips = await Model.find({}).exec();
        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: 'No trips found' });
        }
        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};

// PUT: /trips/:tripCode - Updates a Trip
const tripsUpdateTrip = async (req, res) => {
    try {
        const updatedTrip = await Model.findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true, runValidators: true }
        ).exec();
        if (!updatedTrip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json(updatedTrip);
    } catch (err) {
        return res.status(400).json({ message: 'Error updating trip', error: err });
    }
};

// GET: /trips/:tripCode - Find a single trip by code
const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Model.findOne({ 'code': req.params.tripCode }).exec();
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json(trip);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};

// POST: /trips - Add a new trip
const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description,
        });
        const savedTrip = await newTrip.save();
        return res.status(201).json(savedTrip);
    } catch (err) {
        return res.status(400).json({ message: 'Error saving trip', error: err });
    }
};

// Export all controller functions
module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};