
export const dynamic = 'force-dynamic';

import { Metadata, ResolvingMetadata } from 'next';

import NavBar from '@/components/generic/Account/NavBar';
import Footer from '@/components/generic/Footer';
import ReduxWrapper from '@/components/generic/Account/ReduxWrapper';
import ContentsWrapper from '@/components/generic/Account/ContentsWrapper';
import { Client } from '@/components/generic/Account/Contents/ClientWrapper';
import AccountLoader from '@/components/generic/Account/AccountLoader';


type Props = {
  params: Promise<{  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: 'sRating | Account',
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

export default async function Page({ searchParams }: Props) {
  const searchParameters = await searchParams;
  const view = searchParameters?.view || 'subscriptions';

  return (
    <>
      <ReduxWrapper view = {view as string}>
        <NavBar />
        <ContentsWrapper>
          <>
            <Client />
            <div style = {{ padding: '20px 0px 0px 0px' }}><Footer /></div>
          </>
        </ContentsWrapper>
        <AccountLoader />
      </ReduxWrapper>
    </>
  );
}
