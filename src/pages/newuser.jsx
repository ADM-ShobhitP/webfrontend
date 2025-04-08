import { useState } from "react";
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button, Typography, Alert, Card, CardContent, InputAdornment } from "@mui/material";
import { AccountCircle, Lock, AdminPanelSettings } from "@mui/icons-material";
import Image from "next/image";
import service from "../../service_axios";
import Layout from "@/components/Layout";

export default function NewUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("")
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);


    const roleOptions = [
        { label: "DC", value: 'Data Collector' },
        { label: "AP", value: 'Approver'},
        { label: "SA", value: 'SuperAdmin'}
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        service.post("/users/", {username, password, role})
            .then(response => {
                setSuccess("User created successfully");
                setUsername("");
                setPassword("");
                setRole("");
            })
            .catch(error => {console.error("Error Inputting new user:", error)})
    };

    return (
        <Layout>
            <Box display='flex' justifyContent='center' alignItems='center' minHeight="100vh">
                <Card sx={{ maxWidth: 420, p: 3, boxShadow: 6, borderRadius: 3 }}>
                    <CardContent>
                        <Box display='flex' justifyContent='center' mb={2}>
                            <Image src="/new.png" alt="User Icon" width={80} height={80} />
                        </Box>
                        <Typography variant="h5" fontWeight='bold' textAlign='center' mb={2}>Create New User</Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField fullWidth label="Username" variant="outlined" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} required InputProps={{ startAdornment: <AccountCircle sx={{ color: 'black', mt: 1, mr: 2 }} /> }} />
                            <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required InputProps={{ startAdornment: <Lock sx={{ color: 'black', mt: 1, mr: 2 }} /> }} />
                            <TextField fullWidth select label="Role" value={role} onChange={(e) => setRole(e.target.value)} InputProps={{startAdornment: (<InputAdornment position="start"><AdminPanelSettings sx={{ color: 'black', mt: 1, mr: 2 }} /> </InputAdornment> )}}>
                                {roleOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </TextField>

                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Create User</Button>
            
                            {error && <Alert severity="error">{error}</Alert>}
                            {success && <Alert severity="success">{success}</Alert>}

                        </form>

                    </CardContent>
                </Card>

            </Box>
        </Layout>
    );
}