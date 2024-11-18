import HomePage from './home-page';
import { Metadata } from 'next';

/**
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields
 */
export const metadata: Metadata = {
  title: 'sRating | College basketball stats, ranking, scores, picks',
  description: 'View stats, ranking, live scores, live odds, picks for college basketball',
  openGraph: {
    title: 'sRating.io college basketball rankings',
    description: 'View stats, ranking, live scores, live odds, picks for college basketball',
  },
  twitter: {
    card: 'summary',
    title: 'View stats, ranking, live scores, live odds, picks for college basketball',
  },
};

export default async function Page() {
  return <HomePage />;
}
