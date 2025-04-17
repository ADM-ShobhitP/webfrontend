import { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Button } from "@mui/material";
import Layout from "../components/Layout";
import service from "../../service_axios";

export default function PredictSchedule() {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    const fetchPredictions = () => {
        setLoading(true);
        setError(null);
        service.get("/predictschedule/")
            .then(response => {
                setPredictions(response.data.data || []);
                setMessage(response.data.message || "Predictions loaded successfully!");
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to get predictions. Try Again Later.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPredictions();
    }, []);

    return (
        <Layout>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%' }}>
                    <Typography variant="h2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>Predicted Schedules</Typography>
                    {/* Refresh Data Button */}
                    <Button data-testid='button' variant="contained" color="primary" onClick={fetchPredictions} sx={{ mt: 2 }}>
                        Refresh Data
                    </Button>
                </Box>
                {loading && <CircularProgress data-testid='load' color="primary" />}
                {error && <Alert data-testid='error' severity="error">Error: {error}</Alert>}
                {!loading && !error && message && <Alert severity="success">{message}</Alert>}

                {!loading && !error && predictions.length > 0 && (
                    <TableContainer component={Paper} sx={{ width: '60%', mt: 3, mb: 3, boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)", }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f2f2f2" }}>
                                    <TableCell align="center"><strong>Visit Date</strong></TableCell>
                                    <TableCell align="center"><strong>Predicted Schedule Count</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {predictions.map((prediction, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{prediction.visit_date}</TableCell>
                                        <TableCell align="center">{prediction.predicted_schedule_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {!loading && !error && predictions.length === 0 && (
                    <Typography variant="h6" color="textSecondary">
                        No predictions available.
                    </Typography>
                )}

            </Box>
        </Layout>
    );
}
