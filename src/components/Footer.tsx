import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => (
  <Box component="footer" sx={{ mt: 6, py: 2, textAlign: 'center', opacity: 0.85 }}>
    <Typography variant="body2" color="text.secondary">
      Hecho con ❤️ por <Link href="https://thegamesdb.net/" target="_blank" rel="noopener" underline="hover">TheGamesDB</Link> &copy; {new Date().getFullYear()}
    </Typography>
  </Box>
);

export default Footer;
