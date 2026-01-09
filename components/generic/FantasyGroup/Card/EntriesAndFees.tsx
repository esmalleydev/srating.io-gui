'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Slab from '@/components/ux/container/Slab';
import Columns from '@/components/ux/layout/Columns';
import { FantasyGroup } from '@/types/general';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getTitle, innerBreakPoint, paperStyle } from '../Card';


const EntriesAndFees = (
  {
    fantasy_group,
  } :
  {
    fantasy_group: FantasyGroup
  },
) => {
  const theme = useTheme();

  return (
    <Paper style={paperStyle}>
      <div>
        {getTitle(
          <AttachMoneyIcon style = {{ color: theme.success.main }} />,
          'Entries & Fees',
        )}
        <Columns numberOfColumns={2} breakPoint = {innerBreakPoint}>
          <Slab
            label='Entry Fee'
            primary={fantasy_group.free ? 'Free' : `$${fantasy_group.entry_fee}`}
          />
          {
            fantasy_group.cap ?
              <Slab
                label='Max Capacity'
                primary={`${fantasy_group.entries} users`}
              />
              : ''
          }

          <Slab
            label='Entries allowed per user'
            primary={fantasy_group.entries_per_user}
          />
        </Columns>
      </div>
    </Paper>
  );
};

export default EntriesAndFees;



