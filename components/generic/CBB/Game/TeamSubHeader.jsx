import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';


import Typography from '@mui/material/Typography';

import HelperCBB from '../../../helpers/CBB';


const TeamSubHeader = (props) => {
  const self = this;

  const theme = useTheme();
  const { height, width } = useWindowDimensions();

  const game = props.game;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });


  let teamHeaderFontSize = '1.25rem';
  if (width <= 425) {
    teamHeaderFontSize = '1rem';
  }


  return (
    <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px', 'flexWrap': 'nowrap', 'position': 'sticky', 'top': 100, 'backgroundColor': theme.palette.background.default, 'padding': '20px'}}>
      <Typography style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'margin': '0px 5px', 'fontSize': teamHeaderFontSize}} variant = 'h6'>{CBB.getTeamName('away')}</Typography>
      <Typography style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'margin': '0px 5px', 'fontSize': teamHeaderFontSize}} variant = 'h6'>{CBB.getTeamName('home')}</Typography>
    </div>
  );
}

export default TeamSubHeader;