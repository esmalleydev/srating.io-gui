'use server';

import Surface from 'Surface';

import { notFound } from 'next/navigation';
import ReduxWrapper from '@/components/generic/FantasyGroup/ReduxWrapper';
import Organization from '@/components/helpers/Organization';
import ContentsWrapper from '@/components/generic/FantasyGroup/ContentsWrapper';


import { useServerAPI } from '@/components/serverAPI';

import HomeClientWrapper from '@/components/generic/FantasyGroup/Contents/Home/ClientWrapper';
import { Client as HomeClient } from '@/components/generic/FantasyGroup/Contents/Home/Client';
import { FantasyGroup as FantasyGroupType } from '@/types/general';
import NavBar from '@/components/generic/FantasyGroup/NavBar';

export type getDecorateFantasyGroup = {
  fantasy_group_id: string;
  view?: string;
  // subview?: string | null;
  // season?: number;
  // division_id?: string;
  // trendsSeasons?: string[];
};

class FantasyGroup extends Surface {
  // constructor() {
  //   super();
  // }

  async getData({ fantasy_group_id }) {
    const revalidateSeconds = 5 * 60;

    const fantasy_group: FantasyGroupType = await useServerAPI({
      class: 'fantasy_group',
      function: 'get',
      arguments: {
        fantasy_group_id,
      },
      cache: revalidateSeconds,
    });


    return { fantasy_group };
  }


  async getMetaData({ fantasy_group_id }) {
    const organization_id = this.getOrganizationID();

    const { fantasy_group } = await this.getData({ fantasy_group_id });

    let sportText = '';

    if (organization_id === Organization.getCBBID()) {
      sportText = 'college basketball';
    } else if (organization_id === Organization.getCFBID()) {
      sportText = 'college football';
    }


    return {
      title: `${fantasy_group.name} fantasy group for ${sportText}`,
      description: `${fantasy_group.name} fantasy group for ${sportText}`,
      openGraph: {
        title: `Fantasy league (${fantasy_group.name})`,
        description: `Fantasy league for ${sportText}`,
      },
      twitter: {
        card: 'summary',
        title: `Fantasy league (${fantasy_group.name})`,
        description: `Fantasy league for ${sportText}`,
      },
    };
  }


  async getDecorate(
    {
      fantasy_group_id,
      view,
    }:
    getDecorateFantasyGroup,
  ) {
    const { fantasy_group } = await this.getData({ fantasy_group_id });

    if (!fantasy_group || !fantasy_group.fantasy_group_id) {
      return notFound();
    }

    const getContents = () => {
      if (view === 'foo') {
        return <></>;
      }

      return (
        <HomeClientWrapper>
          <HomeClient fantasy_group_id={fantasy_group_id} />
        </HomeClientWrapper>
      );
    };


    return (
      <ReduxWrapper fantasy_group = {fantasy_group}>
        <NavBar />
        <ContentsWrapper>
          {getContents()}
        </ContentsWrapper>
      </ReduxWrapper>
    );
  }
}

export default FantasyGroup;
