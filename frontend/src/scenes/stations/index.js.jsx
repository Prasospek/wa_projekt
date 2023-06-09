import React, { useEffect, useState } from "react";
import Navbar from "../navbar";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Footer from "../footer/footer";

const Stations = () => {
    const { palette } = useTheme();
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
                setStations(data);
                setLoading(false);
                console.log(data);
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
                            marginBottom: "14px",
                            padding: "0 14px 14px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            width: isNonMobile ? "calc(50% - 15px)" : "100%",
                            marginRight:
                                isNonMobile && index % 2 === 0 ? "15px" : "0",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "27px",
                                marginBottom: "4px",
                                fontFamily: "Arial, sans-serif",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            {station.name}
                        </h2>

                        <p
                            style={{
                                marginBottom: "4px",
                                fontFamily: "Arial, sans-serif",
                                fontSize: "15px",
                            }}
                        >
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
                        {station.connections && (
                            <p
                                style={{
                                    marginBottom: "4px",
                                    fontFamily: "Arial, sans-serif",
                                    fontSize: "15px",
                                }}
                            >
                                <b>Connections:</b>{" "}
                                {station.connections.map((connectionId) => {
                                    const connectedStation = stations.find(
                                        (station) =>
                                            station._id === connectionId
                                    );
                                    return connectedStation ? (
                                        <span
                                            key={connectionId}
                                            style={{
                                                marginLeft: "4px",
                                                marginRight: "4px",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            {connectedStation.name}
                                        </span>
                                    ) : null;
                                })}
                            </p>
                        )}
                        <p
                            style={{
                                marginBottom: "4px",
                                fontFamily: "Arial, sans-seriff",
                                fontSize: "15px",
                            }}
                        >
                            <b>InfoBoard:</b> {infoBoardContents[station._id]}
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
