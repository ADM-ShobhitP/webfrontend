import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout } from "../../redux/AuthSlice";
import { useRouter } from "next/router";
import { AppBar, Toolbar, Box, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";

export default function Navbar() {
    const { isAuthenticated, role } = useSelector((state) => state.authReducer);
    console.log("role", role)

    const dispatch = useDispatch();
    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        dispatch(logout());
        router.push("/login");
    };


    return (
        <AppBar position="static" sx={{ backgroundColor: "blue", paddingX: 2 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "white" }}>GeoLoc</Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        <Link href="/" passHref style={{ textDecoration: "none", color: "white" }}>Home</Link>
                    </Typography>

                    {isAuthenticated && role == "SuperAdmin" && (
                        <>
                            <Link href="/dashboard" passHref><Button color="inherit">Dashboard</Button></Link>
                            <Link href="/approver" passHref><Button color="inherit">Approver</Button></Link>
                            <Link href="/collector" passHref><Button color="inherit">Collector</Button></Link>
                            <Link href="/schedule" passHref><Button color="inherit">Schedule</Button></Link>
                            <Link href="/newuser" passHref><Button color="inherit">User</Button></Link>
                            <Link href="/predict" passHref><Button color="inherit">Prediction</Button></Link>
                            {/* <Link href="/search" passHref><Button color="inherit">Search</Button></Link> */}
                        </>
                    )}
                </Box>

                {isAuthenticated ? (
                    <>
                        <IconButton
                            id="logout"
                            aria-controls={open ? "logout-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            color="inherit"
                            onClick={handleClick}
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            id="logout-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                        >
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button color="inherit" component={Link} disabled href="/login"></Button>
                )}
            </Toolbar>
        </AppBar>
    );
}
