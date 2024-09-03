const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    bikeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
    type: { type: String, enum: ['purchase', 'rental'], required: true },
    totalPrice: Number,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
