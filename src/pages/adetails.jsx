import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from "@mui/x-date-pickers";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Box, Typography, Paper, Button, CircularProgress, Divider, Popover } from "@mui/material";
import service from "../../service_axios";

const Map = dynamic(() => import('../components/MapComponent'), { ssr: false });

export default function ADetails() {
    const [loading, setLoading] = useState(true);
    const [approverData, setApproverData] = useState(null);
    const [polygonBoundary, setPolygonBoundary] = useState([]);
    const [insideBoundary, setInsideBoundary] = useState(false);
    const router = useRouter();
    const {schedule_data} = router.query;
    const [schedule, setSchedule] = useState(JSON.parse(schedule_data));
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchApproverData();
    },[schedule]);

    const fetchApproverData = () => {
        service.get('/gcd/')
            .then(response => {
                const filteredData = response.data.filter(item => item.schedule.id === schedule);
                console.log(filteredData);

                if (filteredData) {
                    console.log("Fetched plant data:",filteredData);
                    setApproverData(filteredData);
        
                    if (filteredData[0]?.boundary && filteredData[0]?.boundary.length > 0) {

                        const formattedBoundary = filteredData[0]?.boundary.map(point => ({
                            lat: point.latitude,
                            lng: point.longitude,
                        }));
                        console.log("Polygon Boundary:", formattedBoundary)
                        setPolygonBoundary(formattedBoundary);
                        pointInPolygon(
                            { lat: filteredData[0].dc_location_lat, lng: filteredData[0].dc_location_long }, 
                            formattedBoundary
                        );
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            .finally(() => setLoading(false));
    };


    const pointInPolygon = (point, polygon) => {
        let x = point.lat, y = point.lng;
        let inside = false;
    
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            let xi = polygon[i].lat, yi = polygon[i].lng;
            let xj = polygon[j].lat, yj = polygon[j].lng;
    
            let intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi) / (yj - yi) + xi));
    
            if (intersect) inside = !inside;
        }
        setInsideBoundary(inside);
    };

    if (loading) {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading Approver Details...</Typography>
            </Box>
        );
    }

    if (!approverData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h5" color="error">No data available for this Approver</Typography>
            </Box>
        );
    }

    return (
        <Layout>
        <Box sx={{ padding: 3 }}>
            {/* Header */}
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h5" fontWeight='bold'>Collected Data</Typography>
                <Typography variant="h6" sx={{ backgroundColor: insideBoundary ? 'green' : 'red', padding: "8px 16px", borderRadius: "8px", textAlign: "center", cursor: "default", color: 'white', "&:hover": { backgroundColor: insideBoundary ? "darkgreen" : "darkred" } }}>
                    {insideBoundary ? "Point Is Inside The Boundary" : "Point Is Outside The Boundary"}
                </Typography>
            </Box>

            {/* Image Section */}
                <Box display="flex" justifyContent="flex-start" my={2}>
                    <Image src='/data.jpg' alt="Collected Data" width={500} height={400} 
                        style={{borderRadius: "8px", border: "4px solid grey", boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)" }} 
                    />
                </Box>

            <Divider sx={{ my: 2 }} />

            {/* Client Details */}
            <Paper sx={{ padding: 2 }}>
                <Typography variant="h5" sx={{mb:2, textDecoration:'underline'}}>Client Details</Typography>
                <Box display='flex' justifyContent='space-between'>
                    <Box>
                        <Typography variant="subtitle1">Client Name:</Typography>
                        <Typography variant="body1" fontWeight="bold">{approverData[0].Name_client}</Typography>

                        <Typography variant="subtitle1">Designation:</Typography>
                        <Typography variant="body1" fontWeight="bold">{approverData[0].Designation_client}</Typography>
                    </Box>
                    <Box textAlign='right'>
                        <Typography variant="subtitle1">Email:</Typography>
                        <Typography variant="body1" fontWeight="bold">{approverData[0].Email_client}</Typography>

                        <Typography variant="subtitle1">Contact:</Typography>
                        <Typography variant="body1" fontWeight="bold">{approverData[0].Contact_client}</Typography>
                    </Box>
                </Box>
            <Divider sx={{ my: 2 }} />

            {/* Visit Details */}
                <Typography variant="h5" sx={{ mb: 2, textDecoration:'underline' }}>Visit Details</Typography>
                <Box display="flex" justifyContent="space-between" sx={{  display: 'inline-flex' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                    
                        <DateCalendar value={dayjs(approverData[0].visit_date)} readOnly slotProps={{
                            day: (ownerState) => ({     
                                onMouseEnter: (event) => {
                                    if (ownerState.day.isSame(dayjs(approverData[0].visit_date), 'day')) {
                                        handlePopoverOpen(event);
                                    }
                                },
                                onMouseLeave: handlePopoverClose,
                            }),
                        }} />
                        <Popover
                            id="mouse-over-popover" sx={{ pointerEvents: 'none' }} open={open} anchorEl={anchorEl} anchorOrigin={{ vertical: 'bottom', horizontal: 'left',}}
                            transformOrigin={{vertical: 'top', horizontal: 'left',}} onClose={handlePopoverClose} disableRestoreFocus
                        >
                            <Box sx={{ padding: 2 }}>
                                <Typography variant="subtitle1">Working Hour:</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {approverData[0].start_time} - {approverData[0].end_time}
                                </Typography>
                            </Box>
                        </Popover>
                    </LocalizationProvider>                    
                </Box>
            <Divider sx={{ my: 2 }} />


            {/* Map */}
                <Typography variant="h5" sx={{ mb: 2,textDecoration:'underline' }}>Plant Location</Typography>
                <Box textAlign='right'>
                    <Typography variant="subtitle1">Plant Name:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                        {approverData[0].plant.name}
                    </Typography>
                </Box>
                <Map
                    location={{ lat: approverData[0].dc_location_lat, lng: approverData[0].dc_location_long }}
                    polygonBoundary={polygonBoundary}
                />
            </Paper>

            {/* Close Button */}
            <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                <Button variant="contained" color="error" onClick={() => router.back()}>Close</Button>
            </Box>
        </Box>
        </Layout>
    );
}