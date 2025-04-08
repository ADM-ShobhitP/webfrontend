import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Container, Box } from '@mui/material';
import { useEffect } from 'react';

export default function Layout({ children }) {
    const { isAuthenticated } = useSelector((state) => state.authReducer);
    const router = useRouter();

    useEffect(() => {
        const path = router.pathname

        if (!isAuthenticated && location.pathname != '/login' && location.pathname != '/signup') {
            let redirectPath = path;
            if (path === '/adetails') redirectPath = '/schedule';
            else if (path === '/aschedule') redirectPath = '/approver';
            else if (path === '/dcschedule') redirectPath = '/collector';
            
            router.push(`/login?return_to=${redirectPath}`);
        }
    });

    return (
        <Box>
            <Navbar isAuthenticated={isAuthenticated} />
            <Container maxWidth="100%" style={{ paddingLeft: 0, paddingRight: 0 }} >{children}</Container>
        </Box>
    );
}