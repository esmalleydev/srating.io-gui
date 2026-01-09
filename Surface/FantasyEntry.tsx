'use server';

import Surface from 'Surface';

import { notFound } from 'next/navigation';
import ReduxWrapper from '@/components/generic/FantasyEntry/ReduxWrapper';
import Organization from '@/components/helpers/Organization';
import ContentsWrapper from '@/components/generic/FantasyEntry/ContentsWrapper';

import { useServerAPI } from '@/components/serverAPI';
import { FantasyEntry as FantasyEntryType, FantasyGroup } from '@/types/general';

export type getDecorateFantasyEntry = {
  fantasy_entry_id: string;
  view?: string;
  // subview?: string | null;
  // season?: number;
  // division_id?: string;
  // trendsSeasons?: string[];
};

class FantasyEntry extends Surface {
  // constructor() {
  //   super();
  // }

  async getData({ fantasy_entry_id }) {
    type Data = {
      fantasy_entry?: FantasyEntryType;
      fantasy_group?: FantasyGroup;
    }

    const data: Data = {};

    data.fantasy_entry = await useServerAPI({
      class: 'fantasy_entry',
      function: 'get',
      arguments: {
        fantasy_entry_id,
      },
    });

    if (
      data.fantasy_entry &&
      data.fantasy_entry.fantasy_group_id
    ) {
      data.fantasy_group = await useServerAPI({
        class: 'fantasy_group',
        function: 'get',
        arguments: {
          fantasy_group_id: data.fantasy_entry.fantasy_group_id,
        },
      });
    }

    return data;
  }


  async getMetaData({ fantasy_entry_id }) {
    const organization_id = this.getOrganizationID();

    const { fantasy_entry } = await this.getData({ fantasy_entry_id });

    let sportText = 'unknown';

    if (organization_id === Organization.getCBBID()) {
      sportText = 'college basketball';
    } else if (organization_id === Organization.getCFBID()) {
      sportText = 'college football';
    }


    return {
      title: `${fantasy_entry?.name} fantasy entry for ${sportText}`,
      description: `${fantasy_entry?.name} fantasy entry for ${sportText}`,
      openGraph: {
        title: `Fantasy league entry (${fantasy_entry?.name})`,
        description: `Fantasy league entry for ${sportText}`,
      },
      twitter: {
        card: 'summary',
        title: `Fantasy league entry (${fantasy_entry?.name})`,
        description: `Fantasy league entry for ${sportText}`,
      },
    };
  }


  async getDecorate(
    {
      fantasy_entry_id,
      view,
    }:
    getDecorateFantasyEntry,
  ) {
    const { fantasy_entry, fantasy_group } = await this.getData({ fantasy_entry_id });

    if (
      !fantasy_entry ||
      !fantasy_group
    ) {
      return notFound();
    }

    const getContents = () => {
      if (view === 'foo') {
        return <></>;
      }


      return (
        <div>{JSON.stringify(fantasy_entry)}</div>
        // <HomeClientWrapper>
        //   <HomeClient fantasy_group_id={fantasy_group_id} />
        // </HomeClientWrapper>
      );
    };


    return (
      <ReduxWrapper fantasy_group = {fantasy_group} fantasy_entry = {fantasy_entry}>
        <ContentsWrapper>
          {getContents()}
        </ContentsWrapper>
      </ReduxWrapper>
    );
  }
}

export default FantasyEntry;
