import CBBPage from './cbb-page';
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: 'sRating | College basketball',
  description: 'College basketball API / Picks',
  openGraph: {
    title: 'sRating.io college basketball API',
    description: 'College basketball API / Picks',
  },
  twitter: {
    card: 'summary',
    title: 'College basketball API / Picks',
  }
};

export default async function Page() {
  return <CBBPage />;
};
