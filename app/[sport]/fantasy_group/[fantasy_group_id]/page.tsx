'use server';

import { Metadata, ResolvingMetadata } from 'next';
import FantasyGroup, { getDecorateFantasyGroup } from 'Surface/FantasyGroup';


type Props = {
  params: Promise<{ sport: string; fantasy_group_id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parameters = await params;
  const { fantasy_group_id } = await params;

  const Surface = new FantasyGroup({
    sport: parameters.sport,
  });

  return Surface.getMetaData({ fantasy_group_id });
}


export default async function Page({ params, searchParams }: Props) {
  const parameters = await params;
  const searchParameters = await searchParams;

  const { fantasy_group_id } = parameters;
  const view = searchParameters?.view;

  const Surface = new FantasyGroup({
    sport: parameters.sport,
  });

  const args: getDecorateFantasyGroup = {
    fantasy_group_id,
  };

  if (view) {
    args.view = view;
  }

  return Surface.getDecorate(args);
}

