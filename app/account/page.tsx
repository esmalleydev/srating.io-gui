'use server';

import { Metadata, ResolvingMetadata } from 'next';

import NavBar from '@/components/generic/Account/NavBar';
import Footer from '@/components/generic/Footer';
import { ClientWrapper } from '@/components/generic/Account/ClientWrapper';


type Props = {
  params: { game_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
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

export default async function Page({ searchParams }) {
  const view = searchParams?.view || 'subscriptions';

  return (
    <>
      <NavBar view = {view} />
      <ClientWrapper view = {view} />
      <div style = {{ padding: '20px 0px 0px 0px' }}><Footer /></div>
    </>
  );
}
