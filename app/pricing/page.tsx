import React from 'react';
import { Metadata } from 'next';

import Pricing from '../../components/generic/Pricing';
import Footer from '@/components/generic/Footer';

type Props = {
  params: Promise<{ player_id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// export const dynamic = 'force-dynamic';

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

const Page = async ({ searchParams }: Props) => {
  const searchParameters = await searchParams;
  const view: string = typeof searchParameters?.view === 'string' ? searchParameters.view : 'picks';
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
