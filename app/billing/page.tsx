
export const dynamic = 'force-dynamic';

import { Metadata, ResolvingMetadata } from 'next';

import Contents from '@/components/generic/Billing/Contents';

// todo deprecate this and move into payment_router?


type Props = {
  params: Promise<{ }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: 'sRating | Billing',
    description: 'Billing information',
    openGraph: {
      title: 'sRating.io billing',
      description: 'Billing information',
    },
    twitter: {
      card: 'summary',
      title: 'Billing information',
    },
  };
}

export default async function Page({ searchParams }: Props) {
  // const searchParameters = await searchParams;

  return (
    <>
      <Contents />
    </>
  );
}
