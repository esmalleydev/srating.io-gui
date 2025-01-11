'use client';

import React, { useState } from 'react';
import { Chip } from '@mui/material';
import { getHeaderColumns } from './columns';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/ranking-slice';
import ColumnPicker from '../ColumnPicker';
import Organization from '@/components/helpers/Organization';
import Text from '@/components/utils/Text';


const ColumnChipPicker = ({ organization_id, view }) => {
  const dispatch = useAppDispatch();
  const columnView = useAppSelector((state) => state.rankingReducer.columnView);
  const customColumns = useAppSelector((state) => state.rankingReducer.customColumns);
  const [customColumnsOpen, setCustomColumnsOpen] = useState(false);

  const headCells = getHeaderColumns({ organization_id, view });

  const handlCustomColumnsSave = (columns) => {
    setCustomColumnsOpen(false);
    localStorage.setItem(`${organization_id}.RANKING.COLUMNS.${view}`, JSON.stringify(columns));
    dispatch(setDataKey({ key: 'customColumns', value: columns }));
    handleRankingView('custom');
  };

  const handlCustomColumnsExit = () => {
    setCustomColumnsOpen(false);
  };

  const handleRankingView = (value) => {
    dispatch(setDataKey({ key: 'columnView', value }));
  };

  const getCBBChips = () => {
    const chips: React.JSX.Element[] = [];

    const availableChips = ['offense', 'defense'];

    if (view !== 'coach') {
      availableChips.forEach((value) => {
        chips.push(
          <Chip key = {value} sx = {{ margin: '5px' }} label={Text.toSentenceCase(value)} variant={columnView !== value ? 'outlined' : 'filled'} color={columnView !== value ? 'primary' : 'success'} onClick={() => handleRankingView(value)} />,
        );
      });
    }

    return chips;
  };

  const getCFBChips = () => {
    const chips: React.JSX.Element[] = [];

    const availableChips = ['passing', 'rushing', 'receiving'];

    if (view !== 'coach') {
      availableChips.forEach((value) => {
        chips.push(
          <Chip key = {value} sx = {{ margin: '5px' }} label={Text.toSentenceCase(value)} variant={columnView !== value ? 'outlined' : 'filled'} color={columnView !== value ? 'primary' : 'success'} onClick={() => handleRankingView(value)} />,
        );
      });
    }

    return chips;
  };

  return (
    <div style = {{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Chip sx = {{ margin: '5px' }} label='Composite' variant={columnView !== 'composite' ? 'outlined' : 'filled'} color={columnView !== 'composite' ? 'primary' : 'success'} onClick={() => handleRankingView('composite')} />
      {Organization.getCBBID() === organization_id ? getCBBChips() : ''}
      {Organization.getCFBID() === organization_id ? getCFBChips() : ''}
      <Chip sx = {{ margin: '5px' }} label='Custom' variant={columnView !== 'custom' ? 'outlined' : 'filled'} color={columnView !== 'custom' ? 'primary' : 'success'} onClick={() => { setCustomColumnsOpen(true); }} />
      <ColumnPicker key = {view} options = {headCells} open = {customColumnsOpen} selected = {customColumns} saveHandler = {handlCustomColumnsSave} closeHandler = {handlCustomColumnsExit} />
    </div>
  );
};

export default ColumnChipPicker;
