import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Pricing_ from '../components/generic/Pricing';

const Pricing = (props) => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>sRating | API Pricing</title>
        <meta name = 'description' content = 'College basketball API / Picks' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball API" />
        <meta property="og:description" content="College basketball API / Picks" />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = 'College basketball API / Picks' />
      </Head>
      <main>
        <div style = {{'padding': '0px 20px'}}>
          <Pricing_ />
        </div>
      </main>
    </div>
  );
}

export default Pricing;
