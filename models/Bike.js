const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the bike schema
const bikeSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }, // Price for purchasing
    rentalPrice: { type: Number, required: true }, // Rental price per day
    category: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }, // Indicates if the bike is available for rent
    rentedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // User who rented the bike
    rentalStartDate: { type: Date, default: null }, // Start date of the rental
    rentalEndDate: { type: Date, default: null } // End date of the rental
});

// Create and export the Bike model
const Bike = mongoose.model('Bike', bikeSchema);
module.exports = Bike;
