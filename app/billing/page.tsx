import Script from 'next/script';
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

