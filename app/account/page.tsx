import AccountPage from './account-page';
import { Metadata } from 'next'

/**
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields
 */
export const metadata: Metadata = {
  title: 'sRating | Account',
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
  return <AccountPage />;
};
