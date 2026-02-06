'use server';

import Surface from 'Surface';

import { notFound } from 'next/navigation';
import ReduxWrapper from '@/components/generic/FantasyEntry/ReduxWrapper';
import Organization from '@/components/helpers/Organization';
import ContentsWrapper from '@/components/generic/FantasyEntry/ContentsWrapper';

import { useServerAPI } from '@/components/serverAPI';
import {
  BracketTeams,
  FantasyBracketSlots,
  FantasyEntryPlayers,
  FantasyEntry as FantasyEntryType,
  FantasyGroup,
  Games,
  Players,
  PlayerTeamSeasons,
  Teams,
} from '@/types/general';

import HomeClientWrapper from '@/components/generic/FantasyEntry/Contents/Home/ClientWrapper';
import { Client as HomeClient } from '@/components/generic/FantasyEntry/Contents/Home/Client';
import NavBar from '@/components/generic/FantasyEntry/NavBar';

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
      fantasy_entry_players?: FantasyEntryPlayers;
      fantasy_group?: FantasyGroup;
      player_team_seasons?: PlayerTeamSeasons;
      players?: Players;
      fantasy_bracket_slots?: FantasyBracketSlots;
      bracket_teams?: BracketTeams;
      teams?: Teams;
      games?: Games;
    }

    const data: Data = {};

    data.fantasy_entry = await useServerAPI({
      class: 'fantasy_entry',
      function: 'get',
      arguments: {
        fantasy_entry_id,
      },
    });

    data.fantasy_entry_players = await useServerAPI({
      class: 'fantasy_entry_player',
      function: 'read',
      arguments: {
        fantasy_entry_id,
      },
    });

    if (data.fantasy_entry_players) {
      data.player_team_seasons = await useServerAPI({
        class: 'player_team_season',
        function: 'read',
        arguments: {
          player_team_season_id: Object.values(data.fantasy_entry_players).map((r) => r.player_team_season_id),
        },
      });

      data.players = await useServerAPI({
        class: 'player',
        function: 'read',
        arguments: {
          player_id: Object.values(data.player_team_seasons || {}).map((r) => r.player_id),
        },
      });
    }

    data.fantasy_bracket_slots = await useServerAPI({
      class: 'fantasy_bracket_slot',
      function: 'read',
      arguments: {
        fantasy_entry_id,
      },
    });


    data.fantasy_group = await useServerAPI({
      class: 'fantasy_group',
      function: 'get',
      arguments: {
        fantasy_group_id: data.fantasy_entry?.fantasy_group_id,
      },
    });

    data.bracket_teams = await useServerAPI({
      class: 'bracket_team',
      function: 'read',
      arguments: {
        organization_id: data.fantasy_group?.organization_id,
        division_id: data.fantasy_group?.division_id,
        season: data.fantasy_group?.season,
        current: 1,
      },
    });

    const team_ids = new Set(Object.values(data.bracket_teams || {}).map((t) => t.team_id));

    Object.values(data.fantasy_bracket_slots || {}).forEach((s) => {
      if (s.actual_first_team_id) {
        team_ids.add(s.actual_first_team_id);
      }
      if (s.actual_second_team_id) {
        team_ids.add(s.actual_second_team_id);
      }
      if (s.picked_first_team_id) {
        team_ids.add(s.picked_first_team_id);
      }
      if (s.picked_second_team_id) {
        team_ids.add(s.picked_second_team_id);
      }
    });

    data.teams = await useServerAPI({
      class: 'team',
      function: 'read',
      arguments: {
        team_id: Array.from(team_ids),
      },
    });

    const game_ids = Object.values(data.fantasy_bracket_slots || {}).map((r) => r.game_id).filter((v) => (v));

    if (game_ids.length) {
      data.games = await useServerAPI({
        class: 'game',
        function: 'getScores',
        arguments: {
          organization_id: data.fantasy_group?.organization_id,
          division_id: data.fantasy_group?.organization_id,
          game_id: Object.values(data.fantasy_bracket_slots || {}).map((r) => r.game_id),
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
    const {
      fantasy_entry,
      fantasy_group,
      fantasy_entry_players,
      player_team_seasons,
      players,
      fantasy_bracket_slots,
      bracket_teams,
      teams,
      games,
    } = await this.getData({ fantasy_entry_id });

    if (
      !fantasy_entry ||
      !fantasy_group
    ) {
      return notFound();
    }

    const getContents = () => {
      return (
        <HomeClientWrapper>
          <HomeClient fantasy_entry_id={fantasy_entry_id} />
        </HomeClientWrapper>
      );
    };


    return (
      <ReduxWrapper
        fantasy_group = {fantasy_group}
        fantasy_entry = {fantasy_entry}
        fantasy_entry_players = {fantasy_entry_players}
        player_team_seasons = {player_team_seasons}
        players = {players}
        fantasy_bracket_slots = {fantasy_bracket_slots}
        bracket_teams = {bracket_teams}
        teams = {teams}
        games = {games}
      >
        <NavBar />
        <ContentsWrapper>
          {getContents()}
        </ContentsWrapper>
      </ReduxWrapper>
    );
  }
}

export default FantasyEntry;
