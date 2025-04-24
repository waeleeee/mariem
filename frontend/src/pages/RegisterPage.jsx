import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Reusing the theme from LoginPage for consistency
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9066f0',
    },
    background: {
      default: '#28243d',
      paper: '#2f2b47',
    },
    text: {
      primary: '#ffffff',
      secondary: '#adb5bd',
    },
  },
  typography: {
    fontFamily: 'sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '6px',
          padding: '10px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9066f0',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#adb5bd',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#9066f0',
          },
        },
      },
    },
  },
});

function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '', // Optional
    address: '', // Optional
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event) => event.preventDefault();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Exclude confirmPassword from the data sent to the backend
      const { confirmPassword, ...registerData } = formData;

      const response = await axios.post('http://localhost:3000/api/users/register', registerData);

      console.log('Registration successful:', response.data);
      setSuccess('Registration successful! Redirecting to login...');

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Registration failed:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        {/* Left Side - Illustration (can be the same or different) */}
        <Grid
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" color="text.secondary" sx={{ p: 4 }}>
            [Illustration Area]
          </Typography>
        </Grid>

        {/* Right Side - Form */}
        <Grid xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{ backgroundColor: 'background.paper' }}>
          <Box
            sx={{
              my: 4, // Adjusted margin for potentially longer form
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
              Adventure starts here 🚀
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Make your app management easy and fun!
            </Typography>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

            <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 1, width: '100%' }}>
              <Grid container spacing={2}>
                 <Grid xs={12} sm={6}>
                   <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    name="firstName"
                    autoComplete="given-name"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              {/* Optional Fields */}
              <TextField
                 margin="normal"
                 fullWidth
                 id="phoneNumber"
                 label="Phone Number (Optional)"
                 name="phoneNumber"
                 autoComplete="tel"
                 value={formData.phoneNumber}
                 onChange={handleChange}
               />
               <TextField
                 margin="normal"
                 fullWidth
                 id="address"
                 label="Address (Optional)"
                 name="address"
                 autoComplete="street-address"
                 multiline
                 rows={2}
                 value={formData.address}
                 onChange={handleChange}
               />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formData.password !== formData.confirmPassword}
                helperText={formData.password !== formData.confirmPassword ? "Passwords do not match" : ""}
                 InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={formData.password !== formData.confirmPassword}
              >
                Sign Up
              </Button>

              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" variant="body2" sx={{ textDecoration: 'none' }}>
                      Sign in instead
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default RegisterPage; 