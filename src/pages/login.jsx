import { useState } from "react";
import Layout from "@/components/Layout";
import { TextField, Button, Box, Typography, CircularProgress, Alert, Paper } from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";
import service from "../../service_axios";
import { login } from "../../redux/AuthSlice";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        service.post("/login/", {username, password})
            .then(response => {
                if (response.data && response.data.access_token) {
                    setSubmitted(true);
                    <Alert severity="success" sx={{ mt: 2 }}>Welcome Back {response.data.username}</Alert>
                    dispatch(login({
                        user: response.data.username,
                        role: response.data.role,
                        token: response.data.access_token
                    }));
                    setLoading(false);
                    const url = new URLSearchParams(location.search);
                    router.push(url.get("return_to") || '/');
                } else {
                    setError("Invalid Username or password");
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
                setError("Failed authentication", "Try Again");
                setLoading(false);
            });
        setSubmitted(false);
    };

    return (
        <Layout>
            <Box sx={{ position:'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundImage: `url('/back.jpeg')`,
                backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1
            }} />
            <Box ml={25} display="flex" justifyContent="center" alignItems="center" height="80vh">
                <Paper elevation={3} sx={{ padding: 4, width: 350, textAlign: 'center', backgroundColor: "rgba(255, 255, 255, 0.7)", boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)", }}>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Image src='/login.png' alt="Profile" width={100} height={100} style={{ borderStyle: '60%' }} />
                    </Box>
                    <Typography variant="h4" gutterBottom>Login Page</Typography>

                    <form onSubmit={handleLogin}>
                        <TextField color="white" fullWidth label="Username" variant="outlined" margin="normal" value={username}
                            onChange={(e) => setUsername(e.target.value)} required InputProps={{ startAdornment: <AccountCircle sx={{ color: 'black', mt: 1, mr: 2 }} /> }} />
                        <TextField color="white" fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password}
                            onChange={(e) => setPassword(e.target.value)} required InputProps={{ startAdornment: <Lock sx={{ color: 'black', mt: 1, mr: 2 }} /> }} />
                        <Button fullWidth type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Login"}
                        </Button>
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                        <Typography variant="body2" sx={{ fontSize: 17, mt: 2 }}>
                            If you are a new user, {" "}
                            <Link href="/signup" style={{ color: '#1E90FF', textDecoration: 'underline', cursor: 'pointer' }}>Sign up</Link>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Layout>        
    );
}