import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import service from "../../service_axios";

export default function Schedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsperPage] = useState(10);


    const fetchSchedules = () => {
        setLoading(true);
        service.get("/schedules/")
            .then(response => {
                console.log(response.data)
                setSchedules(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching schedules", error);
                setError("Failed to fetch schedules. Try Again Later.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleClick = (schedule) => {
        router.push({
            pathname: '/adetails/',
            query: {
                schedule_data: schedule,
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
            <Box  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4 }}>

                <Typography variant="h2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>Schedule Table</Typography>

                {error && (
                    <Typography variant="h3" color="error" sx={{ mt: 3 }} data-testid='error'>{error}</Typography>
                )}

                {loading ? (
                    <Typography variant="h3" sx={{ mt: 3 }}>Loading...</Typography>
                ): (
                    <Paper sx={{ width: '60%', mt: 3, mb: 3, boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)", }}>
                        <TableContainer >
                            <Table>
                                <TableHead>
                                    <TableRow sx={{backgroundColor: '#f2f2f2' }}>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Approver</TableCell>
                                        <TableCell>Collectors</TableCell>
                                        <TableCell>Plant</TableCell>
                                        <TableCell>Visit Date</TableCell>
                                        <TableCell data-testid='button' >Details</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {schedules.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage).map((schedule) => (
                                        <TableRow key={schedule.id}>
                                            <TableCell>{schedule.id}</TableCell>
                                            <TableCell>{schedule.approver.username}</TableCell>
                                            <TableCell>{schedule.collectors.length > 0 ? schedule.collectors.map(collecotor => collecotor.username).join(", ") : "NA"}</TableCell>
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
    )
}