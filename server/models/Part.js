const mongoose = require('mongoose');


const partSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
    },
    categories: {
        type: [String],
        required: true
    },
    qty: {
        type: Number,
        default: 0
    },
    warningQty: {
        type: Number,
        default: 0
    },
    resources: {
        type: [Object]
    }
});

// Hooks

// Static


// Export
const Part = mongoose.model('part', partSchema);
module.exports = Part;