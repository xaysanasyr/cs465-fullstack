const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

const tripsList = async(req, res) => {
    const q = await Model
    .find({})
    .exec();


    if (!q)
    {
        return res
                .status(404)
                .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};


// get /trips/trip code - list a single trip
const tripsFindByCode = async(req, res) => {
    const q = await Model
    .find({'code' : req.params.tripCode })
    .exec();


    if (!q)
    {
        return res
                .status(404)
                .json(err);
    } else {
        return res
            .status(200)
            .json(q);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};