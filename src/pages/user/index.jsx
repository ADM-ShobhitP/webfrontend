import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from "@mui/material";
import service from '../../../service_axios';

export default function UserIndex() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsperPage] = useState(10);

  const fetchUsers = () => {
    setLoading('true');
    service.get('/users/')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users", error);
        setError("Failed to fetch users. Try Again Later");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsperPage = (event) => {
    setRowsperPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>

        <Typography variant="h2" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>User Table</Typography>

        {error && (
          <Typography variant="h3" color="error" sx={{ mt: 3 }} data-testid='error'>{error}</Typography>
        )}

        {loading ? (
          <Typography variant="h3" sx={{ mt: 3 }}>Loading...</Typography>
          ):(
            <Paper sx={{ width: '60%', mt: 3, mb: 3, boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)", }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{backgroundColor: '#f2f2f2' }}>
                                <TableCell>ID</TableCell>
                                <TableCell>User Name</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell data-testid='button'>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell><Button variant="contained" href={'/user/'+user.id}>Details</Button></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>

              <TablePagination rowsPerPageOptions={[10,20,50]} component="div" count={users.length} 
                rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsperPage} 
              />
            </Paper>
        )}
      </Box>
    </Layout>
  )
}
