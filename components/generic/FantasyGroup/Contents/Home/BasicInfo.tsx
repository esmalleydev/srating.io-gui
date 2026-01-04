'use client';

import Organization from '@/components/helpers/Organization';
import { useTheme } from '@/components/hooks/useTheme';
import Paper from '@/components/ux/container/Paper';
import Tile from '@/components/ux/container/Tile';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';
import GroupsIcon from '@mui/icons-material/Groups';
import InfoIcon from '@mui/icons-material/Info';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RuleIcon from '@mui/icons-material/Rule';
import Switch from '@/components/ux/input/Switch';
import React from 'react';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import FantasyGroup from '@/components/helpers/FantasyGroup';
import Dates from '@/components/utils/Dates';
import Slab, { getBaseLabelStyle } from '@/components/ux/container/Slab';

const BasicInfo = ({ isOwner }) => {
  const { width } = useWindowDimensions() as Dimensions;
  const theme = useTheme();

  const organization_id = useAppSelector((state) => state.organizationReducer.organization_id);
  const organizations = useAppSelector((state) => state.dictionaryReducer.organization);
  const terminologies = useAppSelector((state) => state.dictionaryReducer.terminology);
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);

  const FantasyGroupHelper = new FantasyGroup({ fantasy_group });

  console.log(fantasy_group)


  // Helper for Boolean-style numbers (1/0)
  const renderStatus = (val: number) => (val === 1 ? 'Yes' : 'No');

  const breakPoint = 700;
  const innerBreakPoint = 1200;

  const textContainerStyle: React.CSSProperties = {};

  if (width < innerBreakPoint) {
    textContainerStyle.marginBottom = 20;
  }


  return (
    <div>
      <Typography type = 'h6' style={{ marginBottom: 12 }}>League Management</Typography>
      <Columns numberOfColumns={2} breakPoint = {breakPoint}>
        <Paper style={{ padding: 16 }}>
          <div>
            <Typography type = 'subtitle2' style={{ marginBottom: 12, display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
              <span style = {{ display: 'flex', marginRight: 5 }}>
                <InfoIcon style = {{ color: theme.info.main }} />
              </span>
              <div style = {{ display: 'flex', alignItems: 'center', lineHeight: 'initial' }}>
                General Details
              </div>
            </Typography>
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

              <div style = {textContainerStyle}>
                <Typography type = 'caption' style={getBaseLabelStyle({ theme })}>Privacy</Typography>
                <Switch disabled = {!isOwner} label = 'Public' value = {!fantasy_group.private} style = {{ padding: 0 }} />
                {/* <Typography type = 'body1'>{fantasy_group.private ? 'Private' : 'Public'}</Typography> */}
              </div>
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

        <Paper style={{ padding: 16 }}>
          <div>
            <Typography type = 'subtitle2' style={{ marginBottom: 12, display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
              <span style = {{ display: 'flex', marginRight: 5 }}>
                <AttachMoneyIcon style = {{ color: theme.success.main }} />
              </span>
              <div style = {{ display: 'flex', alignItems: 'center', lineHeight: 'initial'}}>
                Entries & Fees
              </div>
            </Typography>
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
                label='Entries allowed per use'
                primary={fantasy_group.entries_per_user}
              />
            </Columns>
          </div>
        </Paper>
        {
          FantasyGroupHelper.isDraft() ?
            <Paper style={{ padding: 16 }}>
              <div>
                <Typography type="subtitle2" style={{ marginBottom: 12, display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
                  <span style = {{ display: 'flex', marginRight: 5 }}>
                    <GroupsIcon style = {{ color: theme.purple[500] }} />
                  </span>
                  <div style = {{ display: 'flex', alignItems: 'center', lineHeight: 'initial' }}>
                    Draft Settings
                  </div>
                </Typography>
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
                    label='Draft pick time limit'
                    primary={`${((fantasy_group.draft_time_per_user_in_seconds ?? 0) / 60).toFixed(2)} mins`}
                  />
                </Columns>
              </div>
            </Paper>
            : ''
        }
        {
          FantasyGroupHelper.isNCAABracket() ?
            <Paper style={{ padding: 16 }}>
              <div>
                <Typography type="subtitle2" style={{ marginBottom: 12, display: 'flex', justifyItems: 'center', alignItems: 'center' }}>
                  <span style = {{ display: 'flex', marginRight: 5 }}>
                    <RuleIcon style = {{ color: theme.purple[500] }} />
                  </span>
                  <div style = {{ display: 'flex', alignItems: 'center', lineHeight: 'initial' }}>
                    Bracket info
                  </div>
                </Typography>
                <Columns numberOfColumns={3} breakPoint = {innerBreakPoint}>
                  <Slab
                    label='Picks locked'
                    primary={renderStatus(fantasy_group.locked)}
                  />
                </Columns>
              </div>
            </Paper>
            : ''
        }
      </Columns>

    </div>
  );
};

export default BasicInfo;
