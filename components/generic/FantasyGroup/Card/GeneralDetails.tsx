'use client';

import Organization from '@/components/helpers/Organization';
import { useTheme } from '@/components/hooks/useTheme';
import Dates from '@/components/utils/Dates';
import Paper from '@/components/ux/container/Paper';
import Slab from '@/components/ux/container/Slab';
import Columns from '@/components/ux/layout/Columns';
import { FantasyGroup } from '@/types/general';
import InfoIcon from '@mui/icons-material/Info';
import { getTitle, innerBreakPoint, paperStyle } from '../Card';
import { useAppSelector } from '@/redux/hooks';


const GeneralDetails = (
  {
    fantasy_group,
  } :
  {
    fantasy_group: FantasyGroup
  },
) => {
  const theme = useTheme();
  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);

  return (
    <Paper style={paperStyle}>
      <div>
        {getTitle(
          <InfoIcon style = {{ color: theme.info.main }} />,
          'General Details',
        )}
        <Columns numberOfColumns={3} breakPoint = {innerBreakPoint}>
          <Slab
            label = 'League name'
            primary = {fantasy_group.name}
            primaryStyle = {{ fontWeight: 600 }}
          />
          <Slab
            label='Sport'
            primary={`${Organization.getEmoji({ organization_id })} ${organizations[organization_id].code} ${fantasy_group.season}`}
          />

          <Slab
            label='Privacy'
            primary={fantasy_group.private ? 'Private' : 'Public'}
          />
          {
            fantasy_group.start_date && fantasy_group.end_date ?
              <Slab
                label='League duration'
                primary={`${Dates.format(fantasy_group.start_date, 'M jS \'y')} to ${Dates.format(fantasy_group.end_date, 'M jS \'y')}`}
              />
              : ''
          }
        </Columns>
      </div>
    </Paper>
  );
};

export default GeneralDetails;
