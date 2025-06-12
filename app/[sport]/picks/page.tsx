'use server';

import { Metadata, ResolvingMetadata } from 'next';
import Picks, { getDecoratePicks } from 'Surface/Games/Picks';

type Props = {
  params: Promise<{ sport: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parameters = await params;

  const Surface = new Picks({
    sport: parameters.sport,
  });

  return Surface.getMetaData();
}


export default async function Page({ params, searchParams }: Props) {
  const parameters = await params;
  const searchParameters = await searchParams;

  const season = searchParameters?.season;
  const division_id = searchParameters?.division_id;
  const date = searchParameters?.date;
  const view = searchParameters?.view || 'picks';

  const Surface = new Picks({
    sport: parameters.sport,
  });

  const args: getDecoratePicks = {
    view,
  };

  if (date) {
    args.date = date;
  }

  if (division_id) {
    args.division_id = division_id;
  }

  if (season) {
    args.season = +season;
  }

  return Surface.getDecorate(args);
}
