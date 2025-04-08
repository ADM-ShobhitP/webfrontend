import { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import service from "../../service_axios";


export default function Collector() {
    const [collectors, setCollectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();


    const fetchCollectors = () => {
        setLoading(true);
        service.get("/collectorslist/")
            .then(response => {
                setCollectors(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching collectors", error);
                setError("Failed to fetch collectors. Try Again Later.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCollectors()
    }, []);

    const handleClick = (collector) => {
        router.push({
            pathname: "/dcschedule/",
            query: {
                collector_data: collector,
            },
        });
    };
    
    return (
        <Layout>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>

                <Typography variant="h2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>Collector Table</Typography>

                {loading ? (
                    <Typography variant="h3" sx={{ mt: 3 }}>Loading...</Typography>
                ): (
                    <TableContainer component={Paper} sx={{ width: '60%', mt: 3, boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)", }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor: '#f2f2f2' }}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Collector Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {collectors.map(collector => (
                                    <TableRow key={collector.id}>
                                        <TableCell>{collector.id}</TableCell>
                                        <TableCell>{collector.username}</TableCell>
                                        <TableCell>{collector.role}</TableCell>
                                        <TableCell><Button variant="contained" onClick={() => handleClick(collector.id)}>Details</Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Layout>
    )
}