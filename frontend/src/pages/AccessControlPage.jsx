import React from 'react';
import { Box, Typography } from '@mui/material';

function AccessControlPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Access Control
      </Typography>
      <Typography>
        Here you can manage permissions and roles for admin users.
      </Typography>
    </Box>
  );
}

export default AccessControlPage; 