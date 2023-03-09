import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

import moment from 'moment';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';

import CompareStatistic from '../../CompareStatistic';
import HelperCBB from '../../../helpers/CBB';

import Api from './../../../Api.jsx';
const api = new Api();

  
const Playbyplay = (props) => {
  const self = this;

  const { height, width } = useWindowDimensions();

  const game = props.game;


  const [requestedPBP, setRequestedPBP] = useState(false);
  const [pbpData, setPBPData] = useState(null);

  // console.log(game);


  if (!requestedPBP) {
    setRequestedPBP(true);
    api.Request({
      'class': 'cbb_game_pbp',
      'function': 'read',
      'arguments': {
        'cbb_game_id': game.cbb_game_id
      },
    }).then((response) => {
      setPBPData(response || {});
    }).catch((e) => {
      setPBPData({});
    });
  }


  const theme = useTheme();

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const sortedPBP = Object.values(pbpData || {}).sort(function(a, b) {
    return +a.external_action_number > +b.external_action_number ? -1 : 1;
    if (a.date_of_entry > b.date_of_entry) {
      return -1;
    }
    if (b.date_of_entry > a.date_of_entry) {
      return 1;
    }

    if (+a.current_period > +b.current_period) {
      return -1;
    }

    if (+a.current_period < +b.current_period) {
      return 1;
    }

    if (a.current_period == b.current_period) {
      if (+a.clock > +b.clock) {
        return -1;
      }

      if (+b.clock > +a.clock) {
        return 1;
      }
    }

    return 0;
  });

  // console.log(sortedPBP);


  return (
    <div>
      {
         sortedPBP.map((cbb_game_pbp) => {

          return (
            <div style = {{'margin': '5px 10px'}}>
              <Typography variant = 'subtitle1'>{cbb_game_pbp.current_period}H {cbb_game_pbp.away_score}-{cbb_game_pbp.home_score} {cbb_game_pbp.clock}</Typography>
              <Typography variant = 'body1'>{cbb_game_pbp.description}</Typography>
            </div>
          );
        })
      }
      {sortedPBP.length === 0 ? <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h5'>No play by play data yet...</Typography> : ''}
    </div>
  );
}

export default Playbyplay;