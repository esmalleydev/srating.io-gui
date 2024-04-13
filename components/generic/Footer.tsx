import React from 'react';


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';



const Footer = () => {
  const hash = process.env.COMMIT_HASH;
  const commitDate = process.env.COMMIT_DATE;


  return (
    <Box component="footer">
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
      {/* <div>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Data from <Link underline="hover" href = "https://stats.ncaa.org" target = "_blank">stats.ncaa.org</Link>
        </Typography>
      </div> */}
      <div>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          SRATING LLC
        </Typography>
      </div>
      <div>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          <Link underline="hover" href = "https://github.com/esmalleydev/srating.io-gui" target = "_blank">{commitDate} - {hash}</Link>
        </Typography>
      </div>
      <div>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          <Link underline="hover" href = "mailto:contact@srating.io">contact@srating.io</Link>
        </Typography>
      </div>
    </Box>
  );
}

export default Footer;