import { useEffect, useState } from "react";
import { Box, Typography, Paper, Container } from "@mui/material";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import Layout from "../components/Layout";
import service from "../../service_axios";
import axios from "axios";

const supersetUrl = 'http://127.0.0.1:8088';
const supersetApiUrl = `${supersetUrl}/api/v1/security`;
const dashboardId = "882012ae-bec0-4234-9ce7-26c533368481";

export default function Dashboard() {
    const [error, setError] = useState("")

    useEffect(() => {

        async function getToken() {
            try {
                const login_body = {
                    username: "admin",
                    password: "admin",
                    provider: "db",
                    refresh: true
                };

                const { data } = await service.post(`${supersetApiUrl}/login`, login_body, {
                    headers: { "Content-Type": "application/json" }
                });

                const access_token = data.access_token;
                console.log("Access Token:", access_token);

                const guest_token_body = {
                    resources: [
                        { 
                            type: "dashboard",
                            id: dashboardId
                        }
                    ],
                    rls: [],
                    user: {
                        username: "admin",
                    }
                    
                };

                console.log("Guest Token API:", `${supersetApiUrl}/guest_token`);

                const { data: guestData } = await axios.post(`${supersetApiUrl}/guest_token/`, guest_token_body, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    }
                });

                const guest_token = guestData.token;
                console.log("Guest Token:", guest_token);

                const mountPoint = document.getElementById("superset-container");
                if (!mountPoint) {
                    console.error("Mount point not found!");
                    return;
                }

                embedDashboard({
                    id: dashboardId,
                    supersetDomain: supersetUrl,
                    mountPoint,
                    fetchGuestToken: () => guest_token,
                    dashboardUiConfig: {
                        filters: { expanded: true },
                        hideTitle: true,
                        urlParams: { Standalone: 3 }
                    }
                });

                setTimeout(() => {
                    const iframe = document.querySelector("iframe");
                    if (iframe) {
                        iframe.style.width = '100%';
                        iframe.style.minHeight = '100vh';
                    }
                }, 1000);

            } catch (error) {
                console.error("Error embedding Superset dashboard:", error);
                setError(error?.message || 'Unknown Error Occured');
            }
        }

        getToken();
    }, []);

    return (
        <Layout>
            <Box sx={{ p: 3, mt: 4, mb: 4, width: "90vw" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>Dashboard</Typography>

                {error && (
                    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#ffebee', mb: 2 }}>
                        <Typography variant="body1" color="error" fontWeight="bold">{error}</Typography>
                    </Paper>
                )}

                <div id="superset-container"></div>
            </Box>
        </Layout>
    );
}
