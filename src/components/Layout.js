import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Container, Box } from '@mui/material';
import { useEffect } from 'react';

export default function Layout({ children }) {
    const { isAuthenticated } = useSelector((state) => state.authReducer);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated && location.pathname != '/login' && location.pathname != '/signup') {
            router.push(`/login?return_to=` + location.pathname);
        }
    });

    return (
        <Box>
            <Navbar isAuthenticated={isAuthenticated} />
            <Container maxWidth="lg" sx={{ mt: 4, mr: '400px' }}>{children}</Container>
        </Box>
    );
}