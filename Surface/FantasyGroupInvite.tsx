'use server';

import Surface from 'Surface';

import { notFound } from 'next/navigation';
import Organization from '@/components/helpers/Organization';


import { useServerAPI } from '@/components/serverAPI';


import Dates from '@/components/utils/Dates';
import Typography from '@/components/ux/text/Typography';
import ContentsWrapper from '@/components/generic/FantasyGroupInvite/ContentsWrapper';
import { Client } from '@/components/generic/FantasyGroupInvite/Client';

export type getDecorateFantasyGroupInvite = {
  fantasy_group_invite_id: string;
  code?: string;
};

class FantasyGroupInvite extends Surface {
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
      title: `Fantasy league invite`,
      description: `Fantasy league for ${sportText}`,
      openGraph: {
        title: `Fantasy league invite`,
        description: `Fantasy league for ${sportText}`,
      },
      twitter: {
        card: 'summary',
        title: `Fantasy league invite`,
        description: `Fantasy league for ${sportText}`,
      },
    };
  }


  async getDecorate(
    {
      fantasy_group_invite_id,
      code,
    }:
    getDecorateFantasyGroupInvite,
  ) {
    const fantasy_group_invite = await useServerAPI({
      'class': 'fantasy_group_invite',
      'function': 'get',
      'arguments': {
        'fantasy_group_invite_id': fantasy_group_invite_id,
      }
    });


    if (
      !fantasy_group_invite ||
      !fantasy_group_invite.fantasy_group_invite_id ||
      !code ||
      fantasy_group_invite.code !== code ||
      Dates.format(fantasy_group_invite.expires, 'Y-m-d') < Dates.format(new Date(), 'Y-m-d')
    ) {
      return (
        <div style = {{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 200
        }}>
          <Typography type = 'h6'>Sorry this invite has expired</Typography>
        </div>
      );
    }

    const fantasy_group = await useServerAPI({
      'class': 'fantasy_group',
      'function': 'get',
      'arguments': {
        'fantasy_group_id': fantasy_group_invite.fantasy_group_id,
      }
    });


    return (
      <ContentsWrapper>
        <Client fantasy_group = {fantasy_group} fantasy_group_invite_id={fantasy_group_invite_id} code = {code} />
      </ContentsWrapper>
    );
  }
}

export default FantasyGroupInvite;
