import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button } from "@mui/material";
import Image from "next/image";
import Layout from "../components/Layout";
import service from "../../service_axios";

export default function DCSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { collector_data } = router.query;    
    const [user, setUser] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsperPage] = useState(10);


    useEffect(() => {
        service.get(`/collschedulesid/?collector_id=${collector_data}`)
            .then(response => {
                console.log(response.data);
                setSchedules(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching schedules:", error);
                setError("Failed to fetch schedules. Try Again Later.");
                setLoading(false);
            });
        service.get(`/users/${collector_data}`)
            .then(response => {
                console.log("users",response.data)
                setUser(response.data)
            })
            .catch(error => {setError("Error in Fetching user details")});
    }, [collector_data]);

    

    const handleClick = (schedule) => {
        router.push({
            pathname: '/adetails/',
            query: {
                schedule_data: JSON.stringify(schedule),
            },
        });
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsperPage = (event) => {
        setRowsperPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    return (
        <Layout>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>

                {/* Collector Details */}
                {user ? (
                    <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                        p: 3, mb: 3, width: "40%", borderRadius: "12px", boxShadow: "3px 3px 15px rgba(0, 0, 0, 0.2)", backgroundColor: "#f9f9f9",
                    }}
                    >
                        <Box display="flex" justifyContent="center" mb={2}>
                            <Image src='/collector.jpeg' alt="Profile" width={120} height={120} 
                                style={{ borderRadius: "50%", border: "4px solid #1976D2", boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)" }} 
                            />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}> Data Collector Details</Typography>
                        <Typography variant="h6" sx={{ color: "#555" }}><strong style={{ color: "#1976D2" }}>ID:</strong> <span>{user.id}</span></Typography>
                        <Typography variant="h6" sx={{ color: "#555" }}><strong style={{ color: "#1976D2" }}>Username:</strong> {user.username}</Typography>
                        <Typography variant="h6" sx={{ color: "#555" }}><strong style={{ color: "#1976D2" }}>Role:</strong> {user.role}</Typography>
                    </Paper>
                ) : (
                    <Typography variant="h5" sx={{ color: "gray", mb: 3 }}>Loading Collector Details...</Typography>
                )}

                {/* Collector's Schedule Table */}
                <Typography variant="h2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>Collectors Schedule Table</Typography>

                {error && (
                    <Typography variant="h3" sx={{ mt: 3 }}>{error}</Typography>
                )}

                {loading ? (
                    <Typography variant="h3" sx={{ mt: 3 }}>Loading...</Typography>
                ) : (
                    <Paper sx={{ width: '60%', mt: 3, mb: 3, boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)", }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{backgroundColor: '#f2f2f2' }}>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Collectors</TableCell>
                                        <TableCell>Plant</TableCell>
                                        <TableCell>Visit Date</TableCell>
                                        <TableCell data-testid='button'>Details</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {schedules.slice(page*rowsPerPage, page*rowsPerPage +rowsPerPage).map((schedule) => (
                                        <TableRow key={schedule.id}>
                                            <TableCell>{schedule.id}</TableCell>
                                            <TableCell>
                                                {schedule.collectors.length > 0 ? schedule.collectors.map(c => c.username).join(", ") : "NA"}
                                            </TableCell>
                                            <TableCell>{schedule.plant.name}</TableCell>
                                            <TableCell>{schedule.visit_date}</TableCell>
                                            <TableCell><Button variant="contained" onClick={() => handleClick(schedule.id)}>Details</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        <TablePagination rowsPerPageOptions={[10,20,50]} component="div" count={schedules.length} 
                            rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsperPage} 
                        />
                    </Paper>
                )}

            </Box>
        </Layout>
    );
}
