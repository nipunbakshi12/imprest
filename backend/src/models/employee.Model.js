const mongoose = require("mongoose");

// Define Schema
const imprestSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            // trim: true,
        },
        amount: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        urgencyLevel: {
            type: String,
            required: true,
        },
        refillAmount: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create Model
const Imprest = mongoose.model("imprest", imprestSchema);

// Export the Model
module.exports = Imprest;
