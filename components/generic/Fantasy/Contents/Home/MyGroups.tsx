'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Button from '@/components/ux/buttons/Button';
import Paper from '@/components/ux/container/Paper';
import Tile from '@/components/ux/container/Tile';
import Typography from '@/components/ux/text/Typography';
import { FantasyGroups } from '@/types/general';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useState } from 'react';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useNavigation } from '@/components/hooks/useNavigation';
import Blank from '@/components/generic/Blank';
import { ReactServerDOMWebpackStatic } from 'next/dist/server/route-modules/app-page/vendored/rsc/entrypoints';
import { Dates } from '@esmalley/ts-utils';

const MyGroups = (
  {
    fantasy_groups,
  }:
  {
    fantasy_groups: FantasyGroups;
  },
) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const initialLimit = 10;
  const [limit, setLimit] = useState(initialLimit);
  // const [viewFinished, setViewFinished] = useState(false);

  const active: FantasyGroups = {};
  const future: FantasyGroups = {};
  const finished: FantasyGroups = {};

  for (const fantasy_group_id in fantasy_groups) {
    const row = fantasy_groups[fantasy_group_id];

    if (row.finished) {
      finished[fantasy_group_id] = row;
    } else if (row.started) {
      active[fantasy_group_id] = row;
    } else {
      future[fantasy_group_id] = row;
    }
  }


  const handleTileClick = (e, fantasy_group_id) => {
    navigation.fantasy_group(`/fantasy_group/${fantasy_group_id}`);
  };

  const getRows = (rows: FantasyGroups) => {
    return Object.values(rows).map((row, index) => {
      if (index > limit) {
        return null;
      }
      let secondary = `Starts ${Dates.format(Dates.parse(row.start_date, true), 'M jS')}`;

      if (row.finished) {
        secondary = `Ended ${Dates.format(Dates.parse(row.end_date, true), 'M jS g:i a')}`;
      } else if (row.started) {
        secondary = `Ends ${Dates.format(Dates.parse(row.end_date, true), 'M jS g:i a')}`;
      }
      return (
        <Tile
          key = {row.fantasy_group_id}
          icon={<SportsEsportsIcon style = {{ color: theme.success.main }} />}
          primary={row.name}
          secondary={secondary}
          buttons = {[
            <Button key = {`view- ${row.fantasy_group_id}`} title = 'View' value = {row.fantasy_group_id} ink handleClick={handleTileClick} />,
          ]}
        />
      );
    }).filter((r) => r !== null);
  };

  const getSection = (rows_) => {
    const rows = getRows(rows_);

    if (!rows || !rows.length) {
      return (
        <Blank
          icon = {<SentimentVeryDissatisfiedIcon />}
          text = 'Not in any leagues!'
        />
      );
    }

    const buttons: React.JSX.Element[] = [];

    if (rows.length > limit) {
      buttons.push(
        <Button
          key = {'view-all'}
          value = 'view-all'
          title = {`View all (${rows.length})`}
          ink
          handleClick={() => setLimit(Infinity)}
        />,
      );
    } else if (limit === Infinity) {
      buttons.push(
        <Button
          key = {'hide-extra'}
          value = 'hide-extra'
          title = {'Show less'}
          ink
          handleClick={() => setLimit(initialLimit)}
        />,
      );
    }

    return (
      <div>
        {rows}
        <div style = {{ textAlign: 'right' }}>{buttons}</div>
      </div>
    );
  };


  const getContents = () => {
    const contents: React.JSX.Element[] = [];

    contents.push(
      <div>
        <Typography type = 'subtitle1' style = {{ color: theme.text.secondary }}>Active leagues</Typography>
        {getSection(active)}
      </div>,
    );

    if (Object.keys(future).length) {
      contents.push(
        <div>
          <Typography type = 'subtitle1' style = {{ color: theme.text.secondary }}>Upcoming leagues</Typography>
          {getSection(future)}
        </div>,
      );
    }

    if (Object.keys(finished).length) {
      contents.push(
        <div>
          <Typography type = 'subtitle1' style = {{ color: theme.text.secondary }}>Finished leagues</Typography>
          {getSection(finished)}
        </div>,
      );
    }


    return contents;
  };


  return (
    <div>
      <Typography type = 'h6'>My fantasy leagues</Typography>
      <Paper style={{ padding: 16 }}>
        {getContents()}
      </Paper>
    </div>
  );
};

export default MyGroups;
