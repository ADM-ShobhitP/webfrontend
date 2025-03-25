import { useState, useEffect } from "react";
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Image from "next/image";
import service from "../../service_axios";

export default function ASchedule() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { approver_id, approver_data } = router.query; 
    const [approver, setApprover] = useState(JSON.parse(approver_data));


    const fetchSchedules = () => {
        setLoading(true);
        service.get(`/apprschedulesid/?approver_id=${approver_id}`)
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
    }, [approver_id]);


    const handleClick = (schedule) => {
        router.push({
            pathname: '/adetails/',
            query: {
                schedule_data: JSON.stringify(schedule),
            },
        });
    };

    // const handleClick = (schedule) => {
    //     router.push({
    //         pathname: '/adetails/',
    //     }, {
    //         state: { schedule },
    //     });
    // };
    


    return (
        <Layout>
            <Box ml={30} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>

                
                {/* Approver Details */}
                {approver ? (
                    <Paper sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                        p: 3, mb: 3, width: "40%", borderRadius: "12px", boxShadow: "3px 3px 15px rgba(0, 0, 0, 0.2)", backgroundColor: "#f9f9f9",
                    }}
                    >
                        <Box display="flex" justifyContent="center" mb={2}>
                            <Image src='/approver.png' alt="Profile" width={120} height={120} 
                                style={{ borderRadius: "50%", border: "4px solid #1976D2", boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)" }} 
                            />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>Approver Details</Typography>
                        <Typography variant="h6" sx={{ color: "#555" }}><strong style={{ color: "#1976D2" }}>ID:</strong> {approver.id}</Typography>
                        <Typography variant="h6" sx={{ color: "#555" }}><strong style={{ color: "#1976D2" }}>Username:</strong> {approver.username}</Typography>
                        <Typography variant="h6" sx={{ color: "#555" }}><strong style={{ color: "#1976D2" }}>Role:</strong> {approver.role}</Typography>
                    </Paper>
                ) : (
                    <Typography variant="h5" sx={{ color: "gray", mb: 3 }}>Loading Approver Details...</Typography>
                )}


                <Typography variant="h2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>Approver's Schedule Table</Typography>

                {loading ? (
                    <Typography variant="h3" sx={{ mt: 3 }}>Loading...</Typography>
                ): (
                    <TableContainer component={Paper} sx={{ width: '60%', mt: 3, mb: 3, boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)", }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor: '#f2f2f2' }}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Approver</TableCell>
                                    <TableCell>Collectors</TableCell>
                                    <TableCell>Plant</TableCell>
                                    <TableCell>Visit Date</TableCell>
                                    <TableCell>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {schedules.map(schedule => (
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
                )}

            </Box>
        </Layout>
    );
}