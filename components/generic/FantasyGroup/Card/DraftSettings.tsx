'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Dates from '@/components/utils/Dates';
import Paper from '@/components/ux/container/Paper';
import Slab from '@/components/ux/container/Slab';
import Columns from '@/components/ux/layout/Columns';
import { FantasyGroup } from '@/types/general';
import GroupsIcon from '@mui/icons-material/Groups';
import { getTitle, innerBreakPoint, paperStyle } from '../Card';
import { useAppSelector } from '@/redux/hooks';


const DraftSettings = (
  {
    fantasy_group,
  } :
  {
    fantasy_group: FantasyGroup
  },
) => {
  const theme = useTheme();
  const terminologies = useAppSelector((state) => state.dictionaryReducer.terminology);

  return (
    <Paper style={paperStyle}>
      <div>
        {getTitle(
          <GroupsIcon style = {{ color: theme.purple[500] }} />,
          'Draft Settings',
        )}
        <Columns numberOfColumns={2} breakPoint = {innerBreakPoint}>
          <Slab
            label='Draft style'
            primary={fantasy_group.draft_type_terminology_id ? terminologies[fantasy_group.draft_type_terminology_id].name : 'Unknown'}
            info={fantasy_group.draft_type_terminology_id ? terminologies[fantasy_group.draft_type_terminology_id].description : 'Unknown'}
          />
          <Slab
            label='Scoring metric'
            primary={fantasy_group.draft_scoring_terminology_id ? terminologies[fantasy_group.draft_scoring_terminology_id].name : 'Unknown'}
            info={fantasy_group.draft_scoring_terminology_id ? terminologies[fantasy_group.draft_scoring_terminology_id].description : 'Unknown'}
          />
          <Slab
            label='Draft start date & time'
            primary={fantasy_group.draft_start_datetime ? Dates.format(Dates.parse(fantasy_group.draft_start_datetime, true), 'M jS @ g:i a') : 'Unknown'}
            info={'You will recieve an email and notification when it is your turn!'}
          />

          {
            fantasy_group.draft_type_terminology_id === 'a03bfac9-e11f-11f0-bc34-529c3ffdbb93' ? // round robin
              <Slab
                label='Draft pick time limit'
                primary={`${((fantasy_group.draft_time_per_user_in_seconds ?? 0) / 60).toFixed(2)} mins`}
              />
              : ''
          }
        </Columns>
      </div>
    </Paper>
  );
};

export default DraftSettings;
