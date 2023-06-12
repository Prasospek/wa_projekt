import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/footer";

const Stations = () => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:800px)");
    const isSmallScreen = useMediaQuery("(max-width:600px)");

    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Stations
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await fetch("http://localhost:8001/stations");
                const data = await response.json();

                // Fetch connections for each station
                const stationPromises = data.map(async (station) => {
                    const connectionsResponse = await fetch(
                        `http://localhost:8001/stations/${station._id}/connections`
                    );
                    const connectionsData = await connectionsResponse.json();

                    return {
                        ...station,
                        connections: connectionsData.connections,
                    };
                });

                const stationsWithConnections = await Promise.all(
                    stationPromises
                );

                setStations(stationsWithConnections);
                setLoading(false);
                console.log(stationsWithConnections);
            } catch (error) {
                console.error("Error fetching stations:", error);
                setError("Failed to fetch stations");
                setLoading(false);
            }
        };

        fetchStations();
    }, []);

    const fetchInfoBoardContent = async (infoBoardId) => {
        try {
            const response = await fetch(
                `http://localhost:8001/info-boards/${infoBoardId}`
            );
            const data = await response.json();
            return data.content;
        } catch (error) {
            console.error("Error fetching InfoBoard content:", error);
            return null;
        }
    };

    const [infoBoardContents, setInfoBoardContents] = useState({});

    useEffect(() => {
        const fetchAllInfoBoardContents = async () => {
            const infoBoardContentsMap = {};

            await Promise.all(
                stations.map(async (station) => {
                    if (station.info_board_id) {
                        const content = await fetchInfoBoardContent(
                            station.info_board_id
                        );
                        infoBoardContentsMap[station._id] = content;
                    }
                })
            );
            setInfoBoardContents(infoBoardContentsMap);
        };
        fetchAllInfoBoardContents();
    }, [stations]);

    const fetchConnections = async () => {
        try {
            const response = await fetch("http://localhost:8001/connections");
            const data = await response.json();
            const connectionsMap = {};

            // Create a map of connections using station IDs as keys
            data.forEach((connection) => {
                if (!connectionsMap[connection.stationId]) {
                    connectionsMap[connection.stationId] = [];
                }
                connectionsMap[connection.stationId].push(
                    connection.connectionId
                );
            });

            setConnections(connectionsMap);
        } catch (error) {
            console.error("Error fetching connections:", error);
        }
    };

    const [connections, setConnections] = useState({});

    useEffect(() => {
        fetchConnections();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar />
            <Box
                p={2}
                display="flex"
                flexDirection={isSmallScreen ? "column" : "row"}
                flexWrap="wrap"
            >
                {stations.map((station, index) => (
                    <Box
                        key={station._id}
                        style={{
                            backgroundColor: palette.primary.main,
                            color: palette.primary.contrastText,
                            marginBottom: "16px",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            width: isNonMobile ? "calc(50% - 16px)" : "100%",
                            marginRight:
                                isNonMobile && index % 2 === 0 ? "16px" : "0",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "24px",
                                marginBottom: "8px",
                            }}
                        >
                            {station.name}
                        </h2>

                        <p style={{ marginBottom: "4px" }}>
                            {station.surface === "underground" ? (
                                <>
                                    <b>Surface:</b> {station.surface} 🌑
                                </>
                            ) : (
                                <>
                                    <b>Surface:</b> {station.surface} 🌕
                                </>
                            )}
                        </p>
                        <p style={{ marginBottom: "4px" }}>
                            <b>Connections:</b>{" "}
                            {connections[station._id] &&
                            Array.isArray(connections[station._id]) ? (
                                connections[station._id].map(
                                    (connection, i) => (
                                        <span key={i}>
                                            {connection}
                                            {i !==
                                            connections[station._id].length - 1
                                                ? ", "
                                                : ""}
                                        </span>
                                    )
                                )
                            ) : (
                                <span>No Connections available!</span>
                            )}
                        </p>
                        <p style={{ marginBottom: "4px" }}>
                            <b>Info Board: </b>
                            {station.info_board_id && (
                                <span style={{ fontStyle: "italic" }}>
                                    {infoBoardContents[station._id]}
                                </span>
                            )}
                        </p>
                    </Box>
                ))}
            </Box>

            <Box mb={5}>
                <Footer />
            </Box>
        </div>
    );
};

export default Stations;