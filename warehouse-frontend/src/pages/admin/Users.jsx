import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@warehub.com',
      fullName: 'Admin User',
      role: 'ADMIN',
      phoneNumber: '0123456789',
      enabled: true,
      createdAt: '2025-01-15',
    },
    {
      id: 2,
      username: 'manager1',
      email: 'manager@warehub.com',
      fullName: 'John Manager',
      role: 'MANAGER',
      phoneNumber: '0987654321',
      enabled: true,
      createdAt: '2025-01-20',
    },
    {
      id: 3,
      username: 'staff1',
      email: 'staff@warehub.com',
      fullName: 'Sarah Staff',
      role: 'WAREHOUSE_STAFF',
      phoneNumber: '0456789123',
      enabled: true,
      createdAt: '2025-02-01',
    },
  ]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleToggleStatus = () => {
    toast.success(`User ${selectedUser.enabled ? 'disabled' : 'enabled'} successfully`);
    handleMenuClose();
  };

  const handleDelete = () => {
    toast.success('User deleted successfully');
    handleMenuClose();
  };

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'error',
      MANAGER: 'warning',
      WAREHOUSE_STAFF: 'info',
      DRIVER: 'success',
      CUSTOMER: 'primary',
    };
    return colors[role] || 'default';
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.username.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
            User Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system users and their permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 700,
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          fullWidth
          placeholder="Search users by name, email, or username..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#FFF7ED' }}>
              <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 40,
                          height: 40,
                          fontWeight: 700,
                        }}
                      >
                        {user.fullName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.replace('_', ' ')}
                      color={getRoleColor(user.role)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={user.enabled ? <CheckCircle /> : <Block />}
                      label={user.enabled ? 'Active' : 'Disabled'}
                      color={user.enabled ? 'success' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, user)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit User
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedUser?.enabled ? (
            <>
              <Block sx={{ mr: 1 }} fontSize="small" />
              Disable User
            </>
          ) : (
            <>
              <CheckCircle sx={{ mr: 1 }} fontSize="small" />
              Enable User
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          Delete User
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Users;