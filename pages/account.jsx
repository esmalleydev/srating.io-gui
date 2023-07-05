import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Cookies from 'universal-cookie';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';


const Account = (props) => {
  const cookies = new Cookies();
  const router = useRouter();

  const hash = process.env.COMMIT_HASH;
  const commitDate = process.env.COMMIT_DATE;

  const logout = () => {
    cookies.remove('session_id');
    router.push('/');
  };

  let session_id = cookies.get('session_id');

  if (!session_id) {
    // TODO REDIRECT, LOGOUT DOESNT WORK IF NAVIGATING DIRECT TO URL
    // logout();
  }

  // todo
  // account overview
  // stripe subscriptions panel

  return (
    <div>
      <Head>
        <title>sRating | Aggregate college basketball ranking, scores, picks</title>
        <meta name = 'description' content = 'View statistic ranking, live score, live odds, picks for college basketball' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball rankings" />
        <meta property="og:description" content="View statistic ranking, live score, live odds, picks for college basketball" />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = 'View statistic ranking, live score, live odds, picks for college basketball' />
      </Head>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Link color="text.secondary" underline="hover" onClick = {logout}>Sign out</Link>
          <Container maxWidth="sm">
            Coming soon
          </Container>
        </Box>
      </main>
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <div>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            🚂Boiler up!🚂
          </Typography>
        </div>
        <div>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            <Link color="text.secondary" underline="hover" href = "mailto:contact@srating.io">Contact me</Link>
          </Typography>
        </div>
        <div>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            <Link color="text.secondary" underline="hover" href = "https://github.com/esmalleydev/srating.io-gui" target = "_blank">{commitDate} - {hash}</Link>
          </Typography>
        </div>
      </Box>
    </div>
  );
}

export default Account;
