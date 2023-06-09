/* IMPORTS */
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

/* ROUTES IMPORT */
import authRoutes from "./routes/auth.js";
import stationRoutes from "./routes/stations.js";
import ticketRoutes from "./routes/tickets.js";
import trainLinesRoutes from "./routes/trainLines.js";
import infoBoardsRoutes from "./routes/infoBoards.js";
import users from "./routes/users.js";

/* SETUP */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/stations", stationRoutes);
app.use("/tickets", ticketRoutes);
app.use("/trainlines", trainLinesRoutes);
app.use("/info-boards", infoBoardsRoutes);
app.use("/users", users);

/* MONGO CONNECTION */
const PORT = process.env.PORT || 7001;

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`ERROR: ${error}`);
    });
