'use client';

import FantasyGroup from '@/components/helpers/FantasyGroup';
import { useTheme } from '@/components/hooks/useTheme';
import Dates from '@/components/utils/Dates';
import Paper from '@/components/ux/container/Paper';
import Modal from '@/components/ux/modal/Modal';
import Typography from '@/components/ux/text/Typography';
import { useAppSelector } from '@/redux/hooks';

import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useState } from 'react';


const UpcomingPicks = () => {
  const theme = useTheme();
  const fantasy_group = useAppSelector((state) => state.fantasyGroupReducer.fantasy_group);
  const fantasy_entrys = useAppSelector((state) => state.fantasyGroupReducer.fantasy_entrys);
  const fantasy_draft_orders = useAppSelector((state) => state.fantasyGroupReducer.fantasy_draft_orders);
  const [openModal, setOpenModal] = useState(false);

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

  const getNextFivePicks = () => {
    const elements: React.JSX.Element[] = [];

    const actual_draft_order = fantasyHelper.getDraftOrder({ fantasy_draft_orders });

    for (let d = 0; d < actual_draft_order.length; d++) {
      const row = actual_draft_order[d];

      if (row.picked) {
        continue;
      }

      if (elements.length >= 5) {
        break;
      }

      const name = (draft_order[d].fantasy_entry_id in fantasy_entrys) ? fantasy_entrys[draft_order[d].fantasy_entry_id].name : draft_order[d].fantasy_entry_id;

      elements.push(
        <Typography key = {d} type = 'caption'># {draft_order[d].pick} - {name} {draft_order[d].eligible ? Dates.format(Dates.parse(draft_order[d].eligible, true), 'M jS g:i a') : ''}</Typography>,
      );
    }

    return elements;
  };


  const getContents = () => {
    if (!fantasy_group.locked) {
      return (
        <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
          <span style = {{ display: 'flex', marginRight: 10 }}><HourglassBottomIcon style = {{ color: theme.purple[500] }} /></span>
          <Typography type = 'body1' style = {{ color: theme.text.secondary }}>Draft not finalized yet!</Typography>
          <Typography type = 'a' style = {{ marginLeft: 5 }} onClick={() => setOpenModal(true)}>Preview draft order</Typography>
        </div>
      );
    }

    const nextPicks = getNextFivePicks();

    if (nextPicks.length) {
      return nextPicks;
    }


    return (
      <div style = {{ padding: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', fontStyle: 'italic', color: theme.text.secondary }}>
        <span style = {{ display: 'flex', marginRight: 10 }}><SentimentVeryDissatisfiedIcon /></span>
        <Typography type = 'body1' style = {{ color: theme.text.secondary }}>No picks remaining!</Typography>
      </div>
    );
  };

  return (
    <div>
      <Typography type = 'h6'>Upcoming picks</Typography>
      <Paper style={{ padding: 20 }}>
        {getContents()}
      </Paper>
      <Modal
        open = {openModal}
        onClose={() => setOpenModal(false)}
      >
        <Typography type = 'h6'>Preview draft order</Typography>
        <div style = {{ maxHeight: 500, overflowY: 'scroll' }}>
          {decorateDraftOrder()}
        </div>
      </Modal>
    </div>
  );
};

export default UpcomingPicks;
