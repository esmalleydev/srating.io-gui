'use client';

import React, { useState, useEffect } from 'react';

import { useAppSelector } from '@/redux/hooks';
import { PlayerStatisticRankings as CBBPlayerStatisticRankings, PlayerStatisticRanking as CBBPlayerStatisticRanking } from '@/types/cbb';
import { PlayerStatisticRankings as CFBPlayerStatisticRankings, PlayerStatisticRanking as CFBPlayerStatisticRanking } from '@/types/cfb';
import Organization from '@/components/helpers/Organization';
import RankTable from '@/components/generic/RankTable';
import Chip from '@/components/ux/container/Chip';
import Typography from '@/components/ux/text/Typography';
import TableColumns from '@/components/helpers/TableColumns';
import Navigation from '@/components/helpers/Navigation';
import Text from '@/components/utils/Text';
import { Player, Players } from '@/types/general';
import { getViewableColumns } from '@/components/generic/Ranking/columns';
import Style from '@/components/utils/Style';


const Roster = ({ organization_id, rosterStats }) => {
  const navigation = new Navigation();

  const [view, setView] = useState<string>('composite');

  const { players, player_statistic_rankings }: { players: Players; player_statistic_rankings: CBBPlayerStatisticRankings | CFBPlayerStatisticRankings} = rosterStats;
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const path = Organization.getPath({ organizations, organization_id });

  useEffect(() => {
    const sessionData = sessionStorage.getItem(`${path}.TEAM.ROSTER.VIEW`);
    if (sessionData) {
      setView(sessionData);
    } else {
      setView('composite');
    }
  }, []);


  const getColumns = (position: string) => {
    let columnView = view;

    if (position !== 'all') {
      columnView = position;
    }
    let viewableColumns = getViewableColumns({ organization_id, view: 'player', columnView, customColumns: [], positions: [position] });

    // todo should move this into getViewableColumns probably and just have a diff view of "roster" ?
    viewableColumns = viewableColumns.filter((column) => {
      if (column === 'team_name' || column === 'rank_delta_combo') {
        return false;
      }

      return true;
    });

    return viewableColumns;
  };

  const columns = TableColumns.getColumns({ organization_id, view: 'player' });

  type groupedPosition = {
    [key:string]: (CBBPlayerStatisticRanking | CFBPlayerStatisticRanking | Player)[];
  }
  const grouped_position_x_playerRows: groupedPosition = {};

  for (const player_statistic_ranking_id in player_statistic_rankings) {
    const row: (CBBPlayerStatisticRanking | CFBPlayerStatisticRanking) & { name?: string } = player_statistic_rankings[player_statistic_ranking_id];

    if (!(row.player_id in players)) {
      continue;
    }

    const player = players[row.player_id];

    if (!player) {
      continue;
    }

    const position_x_grouped_position = {
      QB: 'passing',
      FB: 'rushing',
      RB: 'rushing',
      TE: 'receiving',
      WR: 'receiving',
    };

    let grouped_position: string = 'all';

    if (
      player.position &&
      player.position in position_x_grouped_position
    ) {
      grouped_position = position_x_grouped_position[player.position];
    }

    if (
      !(grouped_position in grouped_position_x_playerRows)
    ) {
      grouped_position_x_playerRows[grouped_position] = [];
    }

    row.name = `${player.first_name.charAt(0)}. ${player.last_name}`;

    grouped_position_x_playerRows[grouped_position].push(row);
  }

  if (!Object.keys(grouped_position_x_playerRows).length && players && Object.keys(players).length) {
    grouped_position_x_playerRows.all = [];
    for (const player_id in players) {
      const player: Player & { name?: string } = players[player_id];
      player.name = `${player.first_name.charAt(0)}. ${player.last_name}`;
      grouped_position_x_playerRows.all.push(player);
    }
  }


  const handleClick = (player_id: string) => {
    navigation.player(`/${path}/player/${player_id}`);
  };

  const handleView = (value: string) => {
    sessionStorage.setItem(`${path}.TEAM.ROSTER.VIEW`, value);
    setView(value);
  };


  const getPlayerTableContents = (): React.JSX.Element => {
    type StatDisplay = {
      label: string;
      value: string;
    }
    let statDisplay: StatDisplay[] = [];

    if (organization_id === Organization.getCBBID()) {
      statDisplay = [
        {
          label: 'Composite',
          value: 'composite',
        },
        {
          label: 'Offense',
          value: 'offense',
        },
        {
          label: 'Defense',
          value: 'defense',
        },
      ];
    }

    const chipContainerStyle = { display: 'flex', justifyContent: 'center' };

    const statDisplayChips: React.JSX.Element[] = [];

    for (let i = 0; i < statDisplay.length; i++) {
      statDisplayChips.push(
        <Chip
          key = {statDisplay[i].value}
          style = {{ margin: '5px 5px 10px 5px' }}
          filled = {view === statDisplay[i].value}
          value = {statDisplay[i].value}
          onClick = {() => { handleView(statDisplay[i].value); }}
          title = {statDisplay[i].label}
        />,
      );
    }


    if (organization_id === Organization.getCBBID()) {
      return (
        <>
          <div className={Style.getStyleClassName(chipContainerStyle)}>{statDisplayChips}</div>
          {getPlayerTableContent('all')}
        </>
      );
    }

    if (organization_id === Organization.getCFBID()) {
      return (
        <>
        <div className={Style.getStyleClassName(chipContainerStyle)}>{statDisplayChips}</div>
        {getPlayerTableContent('passing')}
        {getPlayerTableContent('rushing')}
        {getPlayerTableContent('receiving')}
        </>
      );
    }

    return <></>;
  };

  const getPlayerTableContent = (position: string): React.JSX.Element => {
    const playerRows = grouped_position_x_playerRows[position];

    const defaultPlayerTableSort = 'rank';

    const playerColumns: string[] = getColumns(position);

    let title = <></>;

    if (position !== 'all') {
      title = <Typography type = 'body1'>{Text.toSentenceCase(position)}</Typography>;
    }

    let contents = <></>;

    if (!playerRows || !playerRows.length) {
      contents = <Typography style = {{ textAlign: 'center', margin: '10px 0px' }} type = 'h5'>No player data yet :(</Typography>;
    } else {
      contents =
        <RankTable
          rows={playerRows}
          columns={columns}
          displayColumns={playerColumns}
          rowKey = 'player_id'
          defaultSortOrder = 'asc'
          defaultSortOrderBy = {defaultPlayerTableSort}
          sessionStorageKey = {`${path}.Team.ROSTER.${position}`}
          secondaryKey = 'secondary'
          useAlternateLabel = {true}
          handleRowClick={handleClick}
          />;
    }

    return (
      <>
        {title}
        {contents}
      </>
    );
  };

  return (
    <div style = {{ paddingTop: 10 }}>
      {getPlayerTableContents()}
    </div>
  );
};


export default Roster;
