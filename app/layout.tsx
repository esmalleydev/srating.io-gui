'use server';
import '../styles/global.css';
import 'typeface-roboto';

import React from 'react';
import Script from 'next/script'

import StoreProvider from './StoreProvider';
import SessionHandler from '@/components/handlers/SessionHandler';
import FavoriteHandler from '@/components/handlers/FavoriteHandler';
import SecretWrapper from '@/components/handlers/secret/ClientWrapper';
import SecretHandler from '@/components/handlers/secret/Server';
import DictionaryWrapper from '@/components/handlers/dictionary/ClientWrapper';
import DictionaryHandler from '@/components/handlers/dictionary/Server';
import LayoutWrapper from './LayoutWrapper';



export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <StoreProvider>
        <LayoutWrapper>
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
};

