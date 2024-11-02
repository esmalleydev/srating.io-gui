import React from 'react';
import { Metadata } from 'next';

import Pricing from '../../components/generic/Pricing';
import Footer from '@/components/generic/Footer';

export const metadata: Metadata = {
  title: 'sRating | API Pricing',
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

const Page = ({ searchParams }) => {
  const view: string = searchParams?.view || 'picks';
  return (
    <div>
      <main>
        <div style = {{ padding: '10px' }}>
          <Pricing view = {view} />
        </div>
      </main>
      <div style = {{ padding: '20px 0px 0px 0px' }}><Footer /></div>
    </div>
  );
};

export default Page;
