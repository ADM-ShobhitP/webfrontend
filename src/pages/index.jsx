import Layout from '../components/Layout';
import { useSelector } from "react-redux";
import { Typography, Container, Box, Grid } from "@mui/material";


export default function Home() {
    const { user, role } = useSelector((state) => state.authReducer);

    return (
        <Layout>
            <Container maxWidth="md">
                <Box textAlign="center" mt={5} >
                    <Typography variant="h3" gutterBottom> Admin Website </Typography>
                    {user ? (
                        <>
                            <Typography variant="h3" gutterBottom>Welcome Back {role}: {user}</Typography>
                            <Typography variant="h3" gutterBottom>Project: Geolocation And Data Validation </Typography>
                        </>
                    ) : (
                        <Typography variant="h5" gutterBottom>Please log in to access more features.</Typography>
                    )}

                    {role=="Approver" || role=="Data Collector" ? (
                        <Typography variant='h5' marginTop={10} color='error' gutterBottom>As you are {role}, you cannot access data here as it is only available for Admin. </Typography>
                    ):(
                        <Typography variant="h5" marginBottom={5}> This is a basic Next.js website with a custom navbar. </Typography>
                    )}   
                </Box>
            </Container>
        </Layout>
    );
}
