'use client'

import { Container, Typography, Button, Box } from '@mui/material';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  console.log(error);

  const handleReload = () => {
    window.location.reload();
  };
  
  return (
    <html>
      <body>
        <Container component="main" maxWidth="sm" style={{ textAlign: 'center', marginTop: '20vh' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Oops!
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Something went wrong.
            </Typography>
            <Typography variant="body1" gutterBottom>
              An unexpected error has occurred. Please try reloading the page.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleReload}>
              Reload Page
            </Button>
            <Typography variant='caption'>{JSON.stringify(error)}</Typography>
          </Box>
        </Container>
      </body>
    </html>
  );
}