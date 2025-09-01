export const dynamic = 'force-dynamic';

import { Container, Typography, Box } from '@mui/material';

export default function NotFound() {
  return (
    <Container component="main" maxWidth="sm" style={{ textAlign: 'center', marginTop: '20vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="body1" gutterBottom>
          This page does not exist! Double check the url
        </Typography>
      </Box>
    </Container>
  );
}
