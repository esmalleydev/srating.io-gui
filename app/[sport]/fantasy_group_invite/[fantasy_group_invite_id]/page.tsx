'use server';

import { Metadata, ResolvingMetadata } from 'next';
import FantasyGroupInvite from 'Surface/FantasyGroupInvite';

type Props = {
  params: Promise<{ sport: string; fantasy_group_invite_id: string; }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parameters = await params;

  const Surface = new FantasyGroupInvite({
    sport: parameters.sport,
  });

  return Surface.getMetaData();
}


export default async function Page({ params, searchParams }: Props) {
  const parameters = await params;
  const searchParameters = await searchParams;

  const { fantasy_group_invite_id } = parameters;
  const code = searchParameters?.code;

  const Surface = new FantasyGroupInvite({
    sport: parameters.sport,
  });

  return Surface.getDecorate({
    fantasy_group_invite_id,
    code,
  });
}
