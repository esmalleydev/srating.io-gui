'use server';

import '../styles/global.css';
import 'typeface-roboto';

import React from 'react';
import Script from 'next/script';

import StoreProvider from './StoreProvider';
import SessionHandler from '@/components/handlers/SessionHandler';
import FavoriteHandler from '@/components/handlers/FavoriteHandler';
import SecretWrapper from '@/components/handlers/secret/ClientWrapper';
import SecretHandler from '@/components/handlers/secret/Server';
import DictionaryWrapper from '@/components/handlers/dictionary/ClientWrapper';
import DictionaryHandler from '@/components/handlers/dictionary/Server';
import LayoutWrapper from './LayoutWrapper';
import MutationHandler from '@/components/handlers/MutationHandler';
import Style from '@/components/utils/Style';



export default async function RootLayout({ children }: {children: React.ReactNode}) {
  // const css = Style.getCSS(); // <-- Collect styles generated during SSR
  // Style.flush(); // <-- Clear cache for next request (important for SSR)

  // todo this doesnt work for SSR yet... this rootlayout does not retrigger when a server component is streamed after the fact. need to do some sort of context hook thingy to stream the new css
  // https://chatgpt.com/c/68367c38-f454-8002-a7dc-c16a706a3126

  return (
    <html lang="en">
      {/* <head>
        <style srating-ssr-css = "true" dangerouslySetInnerHTML={{ __html: css }}></style>
      </head> */}
      <StoreProvider>
        <LayoutWrapper>
          <MutationHandler />
          <SecretWrapper><SecretHandler /></SecretWrapper>
          <SessionHandler />
          <FavoriteHandler />
          <DictionaryWrapper><DictionaryHandler /></DictionaryWrapper>
          {children}
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-S67JFT2KZW" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-S67JFT2KZW');
            `}
          </Script>
        </LayoutWrapper>
      </StoreProvider>
    </html>
  );
}

