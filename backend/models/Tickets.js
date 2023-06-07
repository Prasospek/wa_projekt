import mongoose from "mongoose";

// Definice schématu
const ticketSchema = new mongoose.Schema(
    {
        passenger_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        station_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true,
        },
        purchase_method: {
            type: String,
            required: true,
        },
        destination_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true,
        },
        purchase_date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Vytvoření modelu
const Ticket = mongoose.model("Ticket", ticketSchema);

// Export modelu
module.exports = Ticket;
