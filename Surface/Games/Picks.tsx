'use server';

import Organization from '@/components/helpers/Organization';
import StatsClientWrapper from '@/components/generic/Picks/Stats/ClientWrapper';
import StatsServer from '@/components/generic/Picks/Stats/Server';
import StatsLoading from '@/components/generic/Picks/Stats/Loading';
import SubNavBar from '@/components/generic/Picks/SubNavBar';
import PicksComponent from '@/components/generic/Picks/Picks';
import { ClientSkeleton as StatsLoaderClientSkeleton } from '@/components/generic/Picks/StatsLoader/Client';
import StatsLoaderServer from '@/components/generic/Picks/StatsLoader/Server';
import Calculator from '@/components/generic/Picks/Calculator';
import PicksLoader from '@/components/generic/Picks/PicksLoader';
import ClientWrapper from '@/components/generic/Picks/ClientWrapper';
import Dates from '@/components/utils/Dates';
import DateBar from '@/components/generic/DateBar';
import Games from 'Surface/Games';
import { Suspense } from 'react';


export type getDecoratePicks = {
  view: string;
  season?: number;
  division_id?: string;
  date?: string;
};

class Picks extends Games {
  // constructor() {
  //   super();
  // }


  async getMetaData() {
    const organization_id = this.getOrganizationID();

    let sportText = '';

    if (organization_id === Organization.getCBBID()) {
      sportText = 'college basketball';
    } else if (organization_id === Organization.getCFBID()) {
      sportText = 'college football';
    }

    return {
      title: `sRating | ${sportText} betting picks`,
      description: `Best picks for each ${sportText} game`,
      openGraph: {
        title: `sRating.io ${sportText} picks`,
        description: `Best picks for each ${sportText} game`,
      },
      twitter: {
        card: 'summary',
        title: `Best picks for each ${sportText} game`,
      },
    };
  }



  async getDecorate(
    { view, season = this.getCurrentSeason(), division_id = this.getDivisionID(), date }:
    getDecoratePicks,
  ) {
    const datesHelper = new Dates();
    const organization_id = this.getOrganizationID();
    const dates = await this.getDates({ season, organization_id, division_id });
    const selectedDate = date || datesHelper.getClosestDate(datesHelper.getToday(), dates);
    const games = await this.getGames({ date: selectedDate, organization_id, division_id });

    return (
      <>
      <DateBar dates = {dates} date = {selectedDate} />
      <SubNavBar view = {view} />
      <PicksLoader organization_id={organization_id} division_id={division_id} date = {selectedDate} />

      <ClientWrapper>
        {
          view === 'picks' ?
            <PicksComponent games = {games} />
            : ''
        }
        <Suspense key = {selectedDate} fallback = {<StatsLoaderClientSkeleton />}>
          <StatsLoaderServer game_ids={Object.keys(games)} organization_id={organization_id} division_id={division_id} season={season} />
        </Suspense>

        {view === 'calculator' ? <div><Calculator games = {games} date = {selectedDate} /></div> : ''}

        {
          view === 'stats' ?
          <StatsClientWrapper>
            <Suspense key = {selectedDate} fallback = {<StatsLoading />}>
              <StatsServer organization_id={organization_id} division_id={division_id} date = {selectedDate} season = {season} />
            </Suspense>
          </StatsClientWrapper>
            : ''
        }
      </ClientWrapper>
    </>
    );
  }
}

export default Picks;
