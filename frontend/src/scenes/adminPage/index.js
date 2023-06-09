import React, { useEffect, useState } from "react";
import {
    Box,
    useTheme,
    IconButton,
    useMediaQuery,
    Typography,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";

const registerSchema = yup.object().shape({
    firstName: yup
        .string()
        .min(2, "FirstName must be at least 2 characters a-Z0-9")
        .required("required and must be at least 2 characters a-Z0-9"),
    lastName: yup
        .string()
        .min(2, " Lastname must be at least 2 characters a-Z0-9")
        .required("required and must be at least 2 characters a-Z0-9"),
    email: yup
        .string()
        .email("Email must contain @ followed by .com .cz etc (test@test.com)")
        .required("required"),
    password: yup
        .string()
        .min(5, "Password must be at least 5 characters")
        .required("required"),
});

const AdminPage = () => {
    const { palette } = useTheme();
    const isMobile = useMediaQuery("(max-width:800px)");

    const [users, setUsers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    const [totalTickets, setTotalTickets] = useState(0);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8001/users");
            const data = response.data;
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchTotalTickets = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8001/tickets/count"
            );
            const count = response.data.count;
            setTotalTickets(count);
            console.log(count);
        } catch (error) {
            console.error("Error fetching total tickets:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchTotalTickets();
    }, []);

    const handleRemoveUser = async (userId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8001/users/${userId}`);
                // Remove the deleted user from the users state
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user._id !== userId)
                );
                console.log(`Removing user with ID: ${userId}`);
                toast.success(`User deleted successfully!`);
            } catch (error) {
                console.error("Error removing user:", error);
                toast.error("Error, there was a mistake!");
            }
        }
    };

    const handleUpdateUser = (user) => {
        setIsEditing(true);
        setEditedUser(user);
    };

    const handleSaveChanges = async () => {
        try {
            const confirmed = window.confirm(
                "Do you want to save the changes you made?"
            );
            if (confirmed) {
                await registerSchema.validate(editedUser); // Validate the editedUser object
                // If validation passes, proceed with saving changes
                await axios.put(
                    `http://localhost:8001/users/${editedUser._id}`,
                    { editedUser, user: { role: "admin" } }
                );
                // Update the user in the users state
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === editedUser._id ? editedUser : user
                    )
                );
                setIsEditing(false);
                toast.success("Changes saved successfully!");
            }
        } catch (error) {
            console.error("Error saving changes:", error);
            toast.error(error.message);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedUser({});
    };

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch(`http://localhost:8001/tickets`);
                const data = await response.json();
                setTickets(data);

                console.log(data);
            } catch (error) {
                console.error("Error fetching stations:", error);
            }
        };

        fetchTickets();
    }, []);

    const fetchStationName = async (stationId) => {
        try {
            const response = await fetch(
                `http://localhost:8001/stations/${stationId}`
            );
            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error("Error fetching station:", error);
            return null;
        }
    };

    const fetchDestinationName = async (destinationId) => {
        try {
            const response = await fetch(
                `http://localhost:8001/stations/${destinationId}`
            );
            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error("Error fetching destination:", error);
            return null;
        }
    };

    const [tickets, setTickets] = useState([]);
    const [stationNames, setStationNames] = useState({});
    const [destinationNames, setDestinationNames] = useState({});

    useEffect(() => {
        const fetchAllStationNames = async () => {
            const stationNamesMap = {};

            await Promise.all(
                tickets.map(async (ticket) => {
                    const name = await fetchStationName(ticket.station_id);
                    stationNamesMap[ticket.station_id] = name;
                })
            );
            setStationNames(stationNamesMap);
        };

        const fetchAllDestinationNames = async () => {
            const destinationNamesMap = {};

            await Promise.all(
                tickets.map(async (ticket) => {
                    const name = await fetchDestinationName(
                        ticket.destination_id
                    );
                    destinationNamesMap[ticket.destination_id] = name;
                })
            );
            setDestinationNames(destinationNamesMap);
        };

        fetchAllStationNames();
        fetchAllDestinationNames();
    }, [tickets]);

    return (
        <div>
            <Button
                variant="contained"
                style={{
                    width: "45%",
                    display: "flex",
                    margin: "auto",
                    marginBottom: "1rem", // Add margin-bottom
                    marginTop: "1rem", // Add margin-bottom
                }}
            >
                Users
            </Button>

            <div style={{ width: "100%" }}></div>
            <ToastContainer />
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    marginLeft: "3rem",
                    marginRight: "3rem",
                }}
            >
                {users.map((user) => (
                    <Box
                        key={user._id}
                        bgcolor={palette.primary.main}
                        color={palette.background.alt}
                        padding="1rem"
                        marginBottom="1rem"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        borderRadius="4px"
                        width={isMobile ? "100%" : "45%"}
                    >
                        {isEditing && editedUser._id === user._id ? (
                            <div>
                                <Typography variant="h6">
                                    Editing User:
                                </Typography>
                                <Box marginTop="1rem">
                                    <Typography variant="body1">
                                        First Name:
                                    </Typography>
                                    <input
                                        type="text"
                                        value={editedUser.firstName}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                firstName: e.target.value,
                                            })
                                        }
                                    />
                                </Box>
                                <Box marginTop="1rem">
                                    <Typography variant="body1">
                                        Last Name:
                                    </Typography>
                                    <input
                                        type="text"
                                        value={editedUser.lastName}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                lastName: e.target.value,
                                            })
                                        }
                                    />
                                </Box>
                                <Box marginTop="1rem">
                                    <Typography variant="body1">
                                        Email:
                                    </Typography>
                                    <input
                                        type="email"
                                        value={editedUser.email}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </Box>
                                <Box marginTop="1rem">
                                    <Typography variant="body1">
                                        Password:
                                    </Typography>
                                    <input
                                        type="password"
                                        value={editedUser.password}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                </Box>
                                <Box marginTop="1rem" display="flex">
                                    <Button
                                        variant="contained"
                                        onClick={handleSaveChanges}
                                        sx={{ marginRight: "1rem" }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </div>
                        ) : (
                            <div>
                                <Typography
                                    variant="h3"
                                    gutterBottom
                                    fontSize={"1.5rem"}
                                >
                                    {`${user.firstName} ${user.lastName}`}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    fontSize={"0.95rem"}
                                >
                                    <strong>First Name:</strong>{" "}
                                    {user.firstName}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    fontSize={"0.95rem"}
                                >
                                    <strong>Last Name:</strong> {user.lastName}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    fontSize={"0.95rem"}
                                >
                                    <strong>Email:</strong> {user.email}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    style={{ wordBreak: "break-word" }}
                                    fontSize={"0.95rem"}
                                >
                                    <strong>Password:</strong> {user.password}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    fontSize={"0.95rem"}
                                >
                                    <strong>Role:</strong> {user.role}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    fontSize={"0.95rem"}
                                >
                                    <strong>Passenger ID:</strong> {user._id}
                                </Typography>

                                <Box marginTop="1rem" display="flex">
                                    <IconButton
                                        color="inherit"
                                        onClick={() =>
                                            handleRemoveUser(user._id)
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        color="inherit"
                                        onClick={() => handleUpdateUser(user)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Box>
                            </div>
                        )}
                    </Box>
                ))}

                <div style={{ width: "100%" }}>
                    <Button
                        variant="contained"
                        style={{
                            width: "45%",
                            display: "flex",
                            margin: "auto",
                            marginBottom: "1rem", // Add margin-bottom
                            marginTop: "1rem", // Add margin-bottom
                        }}
                    >
                        Total Tickets: {totalTickets}
                    </Button>
                </div>
                {tickets.map((ticket) => (
                    <Box
                        key={ticket._id}
                        bgcolor={palette.primary.main}
                        color={palette.background.alt}
                        padding="1rem"
                        marginBottom="1rem"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        borderRadius="4px"
                        width={isMobile ? "100%" : "45%"}
                    >
                        <div>
                            <Typography variant="body1">
                                <b>Passenger ID:</b> {ticket.passenger_id}
                            </Typography>
                            <Typography variant="body1">
                                <b>Ticket ID:</b> {ticket._id}
                            </Typography>
                            <Typography variant="body1">
                                <b>Purchase method:</b> {ticket.purchase_method}
                            </Typography>
                            <Typography variant="body1">
                                <b>Station Name:</b>{" "}
                                {stationNames[ticket.station_id] || "Unknown"}
                            </Typography>
                            <Typography variant="body1">
                                <b>Destination Name:</b>{" "}
                                {destinationNames[ticket.destination_id] ||
                                    "Unknown"}
                            </Typography>
                            <Typography variant="body1">
                                <b>Purchase Date: </b>{" "}
                                {new Date(
                                    ticket.purchase_date
                                ).toLocaleString()}
                            </Typography>
                        </div>
                    </Box>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
