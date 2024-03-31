const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    orderTime: {
        type: String,
        required: true
    },
    orderTotal: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);
