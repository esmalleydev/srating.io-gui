import React from 'react';
import { Metadata } from 'next';

import { Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'sRating | Terms and conditions',
  description: 'College basketball API / Picks',
  openGraph: {
    title: 'sRating.io college basketball API',
    description: 'College basketball API / Picks',
  },
  twitter: {
    card: 'summary',
    title: 'College basketball API / Picks',
  },
};

const Terms = () => {
  return (
    <div>
      <main>
        <div style = {{ padding: 20 }}>
          <Typography variant='h3'>SRATING API Terms and Conditions</Typography>
          <Typography variant='body1'>By purchasing any of our products, you agree to these terms and conditions.</Typography>
          <br />
          <Typography variant='body1'>These Terms and Conditions ("Agreement") govern your access to and use of the API and Picks provided by SRATING LLC ("Company," "we," "us," or "our"). By accessing or using the API or Picks, you agree to comply with these terms. If you do not agree with these terms, you may not access or use the API or Picks.</Typography>
          <br />

          <Typography variant='h5'>1. Definitions</Typography>
          <br />
          <Typography variant='body1'>1.1. "API" refers to the application programming interface provided by SRATING LLC, including any related documentation, tools, and materials.</Typography>
          <br />
          <Typography variant='body1'>1.2. "Picks" refers to any selections, recommendations, predictions, analyses, or data provided by SRATING LLC, which may include sports predictions, betting insights, and related information.</Typography>
          <br />

          <Typography variant='h6'>2. Access and Use</Typography>
          <br />
          <Typography variant='body1'>2.1. API Access: You may access and use the API solely for the purpose of integrating it into your application, website, or service in accordance with the API documentation provided by SRATING LLC.</Typography>
          <br />
          <Typography variant='body1'>2.2. Picks Access: You may access and use the Picks solely for personal and non-commercial purposes. You may not distribute, sell, or otherwise commercially exploit the Picks without explicit written permission from SRATING LLC.</Typography>
          <br />

          <Typography variant='h6'>3. Restrictions</Typography>
          <br />
          <Typography variant='body1'>Do not resell or redistribute our data as a data product, including but not limited to data dumps and API access. If we suspect the resale of our data as a data product, we reserve the right to revoke your API key and block all future API access attempts by you. If you are unsure about what is permissible, please contact us.</Typography>
          <br />

          <Typography variant='h6'>4. Fees and Payment</Typography>
          <br />
          <Typography variant='body1'>4.1. API Access Fees: Access to the API may be subject to subscription fees or usage-based fees. Fees will be specified in a separate agreement or on our website.</Typography>
          <br />
          <Typography variant='body1'>4.2. No Refunds: Subscription fees are non-refundable, and you are responsible for any fees incurred.</Typography>
          <br />

          <Typography variant='h6'>5. Termination</Typography>
          <br />
          <Typography variant='body1'>5.1. Termination by Company: SRATING LLC reserves the right to terminate or suspend your access to the API or Picks at any time for any reason, including violation of these terms.</Typography>
          <br />
          <Typography variant='body1'>5.2. Effect of Termination: Upon termination, all rights granted to you under this Agreement will cease, and you must immediately cease all use of the API and Picks.</Typography>
          <br />

          <Typography variant='h6'>6. Disclaimer of Warranty</Typography>
          <br />
          <Typography variant='body1'>6.1. The API and Picks are provided "as is" and "as available." SRATING LLC makes no warranties, whether express, implied, or statutory, regarding the API or Picks, including warranties of merchantability, fitness for a particular purpose, and non-infringement.</Typography>
          <br />

          <Typography variant='h6'>7. Limitation of Liability</Typography>
          <br />
          <Typography variant='body1'>7.1. We take care to ensure the accuracy and timeliness of our data. However on occasion, errors may be present in the data. We will not be held liable for losses resulting from actions made on the data provided in our API, whether the data is correct or erroneous or outdated. It is your responsibility to independently verify the accuracy of the data before using it. We encourage you to inform us of any errors.</Typography>
          <br />
          <Typography variant='body1'>7.2. To the maximum extent permitted by law, SRATING LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.</Typography>
          <br />

          <Typography variant='h6'>8. Changes to the Agreement</Typography>
          <br />
          <Typography variant='body1'>8.1. SRATING LLC reserves the right to modify or update these terms at any time. Changes will be effective upon posting on our website or notifying you via email.</Typography>
        </div>
      </main>
    </div>
  );
};

export default Terms;
