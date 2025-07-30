'use client';

// import { Box, CircularProgress } from '@mui/material';
// import React, { useEffect, useState } from 'react';

// Looks like this fixed this in nextjs 15 / react 19

/**
 * This gets rendered server side on first load,
 * so the theme is wrong, which applies stuff on the body
 * so show a loading screen until it is on the client >.>
 */
const LayoutWrapper = ({ children }) => {
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // if (!isClient) {
  //   return (
  //     <body>
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           height: '100vh',
  //         }}
  //       >
  //         <CircularProgress />
  //       </Box>
  //     </body>
  //   );
  // }


  return (
    <body>
      {children}
    </body>
  );
};

export default LayoutWrapper;
