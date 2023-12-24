import BillingPage from './billing-page';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'sRating | Billing',
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
  return <BillingPage />;
};

