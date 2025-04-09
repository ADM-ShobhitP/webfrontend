import { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import service from "../../service_axios";


export default function Approver() {
    const [approvers, setApprovers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchApprovers = () => {
        setLoading(true);
        service.get("/approverlist/")
            .then(response => {
                setApprovers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching approvers", error);
                setError("Failed to fetch approvers. Try Again Later.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchApprovers()
    }, []);


    const handleClick = (approver) => {
        router.push({
            pathname: '/aschedule/',
            query: {
                approver_id: approver,
            },
        });
    };

    return (
        <Layout>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>

                <Typography variant="h2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>Approver Table</Typography>

                {loading ? (
                    <Typography variant="h3" sx={{ mt: 3 }}>Loading...</Typography>
                ): error ? (
                    <Typography variant="h4" sx={{ mt: 3, color: 'red' }}>{error}</Typography>
                ) : approvers.length === 0 ? (
                    <Typography variant="h4" sx={{ mt: 3 }}>No Approvers found.</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ width: '60%', mt: 3, boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)", }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor: '#f2f2f2' }}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Approver Name</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {approvers.map(approver => (
                                    <TableRow key={approver.id}>
                                        <TableCell>{approver.id}</TableCell>
                                        <TableCell>{approver.username}</TableCell>
                                        <TableCell>{approver.role}</TableCell>
                                        <TableCell><Button variant="contained" onClick={() => handleClick(approver.id)}>Details</Button></TableCell>
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