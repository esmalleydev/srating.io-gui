'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Dates from '@/components/utils/Dates';
import Paper from '@/components/ux/container/Paper';
import Slab from '@/components/ux/container/Slab';
import Columns from '@/components/ux/layout/Columns';
import { FantasyGroup as FantasyGroupType } from '@/types/general';
import GroupsIcon from '@mui/icons-material/Groups';
import { getTitle, innerBreakPoint, paperStyle } from '../Card';
import { useAppSelector } from '@/redux/hooks';
import FantasyGroup from '@/components/helpers/FantasyGroup';
import Button from '@/components/ux/buttons/Button';
import React, { useState } from 'react';
import Modal from '@/components/ux/modal/Modal';
import Typography from '@/components/ux/text/Typography';


const DraftSettings = (
  {
    fantasy_group,
  } :
  {
    fantasy_group: FantasyGroupType
  },
) => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const terminologies = useAppSelector((state) => state.dictionaryReducer.terminology);

  const fantasy_entrys = useAppSelector((state) => state.fantasyGroupReducer.fantasy_entrys);
  const fantasy_draft_orders = useAppSelector((state) => state.fantasyGroupReducer.fantasy_draft_orders);

  const fantasyHelper = new FantasyGroup({ fantasy_group });

  const draft_order = fantasyHelper.getDraftOrder({ fantasy_entrys, fantasy_draft_orders });

  const decorateDraftOrder = () => {
    const elements: React.JSX.Element[] = [];
    let current_round = 0;
    for (let d = 0; d < draft_order.length; d++) {
      if (current_round !== draft_order[d].round) {
        current_round++;
        elements.push(<Typography key = {`round-${current_round}`} type = 'subtitle1' style = {{ color: theme.info.main }}>Round {current_round}</Typography>);
      }

      const name = (draft_order[d].fantasy_entry_id in fantasy_entrys) ? fantasy_entrys[draft_order[d].fantasy_entry_id].name : draft_order[d].fantasy_entry_id;

      elements.push(
        <Typography key = {d} type = 'caption'># {draft_order[d].pick} - {name} {draft_order[d].eligible ? Dates.format(Dates.parse(draft_order[d].eligible, true), 'M jS g:i a') : ''}</Typography>,
      );
    }
    return elements;
  };

  return (
    <>
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
            fantasy_group.draft_time_per_user_in_seconds ?
              <Slab
                label='Draft pick time limit'
                primary={`${((fantasy_group.draft_time_per_user_in_seconds ?? 0) / 60).toFixed(2)} mins`}
              />
              : ''
          }
        </Columns>
      </div>
      <div style = {{ textAlign: 'right' }}>
        {draft_order.length ? <Button ink value = 'draft_order' title = {fantasy_group.locked ? 'View draft order' : 'Preview draft order'} handleClick={() => setOpenModal(true)} /> : ''}
      </div>
    </Paper>
    <Modal
      open = {openModal}
      onClose={() => setOpenModal(false)}
      showCloseButton
    >
      <Typography type = 'h6'>{fantasy_group.locked ? 'Draft order' : 'Preview draft order'}</Typography>
      <div style = {{ maxHeight: 500, overflowY: 'scroll', width: '100%' }}>
        {decorateDraftOrder()}
      </div>
    </Modal>
    </>
  );
};

export default DraftSettings;
