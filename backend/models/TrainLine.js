import mongoose from "mongoose";

// Definice schématu
const trainLineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        stations: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Station",
            },
        ],
        status: {
            type: String,
            enum: ["operational", "disruption", "maintenance"],
            default: "operational",
            required: true,
        },
        time: {
            type: Number,
            required: true,
        },
        originalTime: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// Vytvoření modelu
const TrainLine = mongoose.model("TrainLine", trainLineSchema);

// Export modelu
export default TrainLine;
