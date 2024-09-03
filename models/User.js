const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: String,
    age: Number,
    cart: [{
        bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike' },
        quantity: { type: Number, default: 1 },
    }],
    orders: [{
        bikes: [{
            bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike' },
            quantity: { type: Number, default: 1 },
        }],
        totalPrice: Number,
        date: { type: Date, default: Date.now },
    }]
});

module.exports = mongoose.model('User', userSchema);
