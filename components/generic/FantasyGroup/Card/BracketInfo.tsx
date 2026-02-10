'use client';

import { useTheme } from '@/components/hooks/useTheme';
import RuleIcon from '@mui/icons-material/Rule';
import Paper from '@/components/ux/container/Paper';
import Slab from '@/components/ux/container/Slab';
import Columns from '@/components/ux/layout/Columns';
import { FantasyGroup } from '@/types/general';
import { getTitle, innerBreakPoint, paperStyle } from '../Card';


const BracketInfo = (
  {
    fantasy_group,
  } :
  {
    fantasy_group: FantasyGroup
  },
) => {
  const theme = useTheme();

  const renderStatus = (val: number) => (val === 1 ? 'Yes' : 'No');

  return (
    <Paper style={paperStyle}>
      <div>
        {getTitle(
          <RuleIcon style = {{ color: theme.purple[500] }} />,
          'Bracket info',
        )}
        <Columns numberOfColumns={3} breakPoint = {innerBreakPoint}>
          <Slab
            label='Picks locked'
            primary={renderStatus(fantasy_group.locked)}
          />
        </Columns>
      </div>
    </Paper>
  );
};

export default BracketInfo;
