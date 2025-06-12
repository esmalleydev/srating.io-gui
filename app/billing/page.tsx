

import Script from 'next/script';
import BillingPage from './billing-page';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ sport: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: 'sRating | Billing',
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
}


export default async function Page() {
  return (
    <>
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}

        gtag('event', 'conversion', {'send_to': 'AW-11331182972/mmDvCKu5sIMaEPzCkJsq'});
      `}
    </Script>
    <BillingPage />
    </>
  );
};

