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
  Checkbox,
  FormControlLabel,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Alert
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Placeholder for the illustration image
// TODO: Replace with actual image path if available
// import illustration from '../assets/login-illustration.svg'; // Example path

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9066f0', // Purple accent from the screenshot
    },
    background: {
      default: '#28243d', // Dark background from the screenshot
      paper: '#2f2b47', // Slightly lighter background for the form card
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
              borderColor: 'rgba(255, 255, 255, 0.23)', // Default border color
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)', // Hover border color
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9066f0', // Focused border color (primary)
            },
          },
          '& .MuiInputLabel-root': {
            color: '#adb5bd', // Label color
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#9066f0', // Focused label color
          },
        },
      },
    },
  },
});

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password,
      });

      console.log('Login successful:', response.data);
      const { token, user } = response.data;

      // Store token and user info (you might want more secure storage)
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', `${user.firstName} ${user.lastName}`);
      localStorage.setItem('userId', user.id);

      // Navigate based on role
      if (user.role === 'admin') {
          navigate('/admin/dashboard');
      } else {
          // Navigate non-admins to a general page (e.g., shop or profile)
          navigate('/shop'); // Assuming /shop is the public product page
      }

    } catch (err) {
      console.error('Login failed:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        {/* Left Side - Illustration */}
        <Grid
          xs={false}
          sm={4}
          md={7}
          sx={{
            // Replace with actual image or keep background color
            // backgroundImage: `url(${illustration})`,
            // backgroundRepeat: 'no-repeat',
            // backgroundSize: 'contain',
            // backgroundPosition: 'center',
            backgroundColor: (theme) => theme.palette.background.default,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* You can add an img tag here if you have the image file */}
          <Typography variant="h3" color="text.secondary" sx={{ p: 4 }}>
            [Illustration Area]
          </Typography>
        </Grid>

        {/* Right Side - Form */}
        <Grid
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{ backgroundColor: 'background.paper' }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Replace with your logo if available */}
            <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
              Welcome to Radio Store! 👋
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Please sign-in to your account
            </Typography>

            {error && (
                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                    {error}
                </Alert>
             )}

            <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid>
                   <FormControlLabel
                    control={<Checkbox value="remember" color="primary" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                    label="Remember me"
                  />
                </Grid>
                <Grid>
                  <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                    Forgot Password?
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Sign In
              </Button>

              <Grid container justifyContent="center">
                <Grid>
                  <Typography variant="body2" color="text.secondary">
                    New on our platform?{' '}
                    <Link component={RouterLink} to="/register" variant="body2" sx={{ textDecoration: 'none' }}>
                       Create an account
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

export default LoginPage; 