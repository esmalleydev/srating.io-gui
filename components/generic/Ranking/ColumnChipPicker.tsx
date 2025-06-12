'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDataKey } from '@/redux/features/ranking-slice';
import ColumnPicker from '../ColumnPicker';
import Organization from '@/components/helpers/Organization';
import Text from '@/components/utils/Text';
import Chip from '@/components/ux/container/Chip';
import TableColumns from '@/components/helpers/TableColumns';


const ColumnChipPicker = ({ organization_id, view }) => {
  const dispatch = useAppDispatch();
  const columnView = useAppSelector((state) => state.rankingReducer.columnView);
  const customColumns = useAppSelector((state) => state.rankingReducer.customColumns);
  const [customColumnsOpen, setCustomColumnsOpen] = useState(false);

  const headCells = TableColumns.getColumns({ organization_id, view });

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
          <Chip key = {value} style = {{ margin: '5px' }} title={Text.toSentenceCase(value)} filled={(columnView === value)} value = {value} onClick={() => handleRankingView(value)} />,
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
          <Chip key = {value} style = {{ margin: '5px' }} title={Text.toSentenceCase(value)} filled={(columnView === value)} value = {value} onClick={() => handleRankingView(value)} />,
        );
      });
    }

    return chips;
  };

  return (
    <div style = {{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      <Chip key = {'composite'} style = {{ margin: '5px' }} title={Text.toSentenceCase('composite')} filled={(columnView === 'composite')} value = {'composite'} onClick={() => handleRankingView('composite')} />
      {Organization.getCBBID() === organization_id ? getCBBChips() : ''}
      {Organization.getCFBID() === organization_id ? getCFBChips() : ''}
      <Chip key = {'custom'} style = {{ margin: '5px' }} title={Text.toSentenceCase('custom')} filled={(columnView === 'custom')} value = {'custom'} onClick={() => setCustomColumnsOpen(true)} />
      <ColumnPicker key = {view} options = {headCells} open = {customColumnsOpen} selected = {customColumns} saveHandler = {handlCustomColumnsSave} closeHandler = {handlCustomColumnsExit} />
    </div>
  );
};

export default ColumnChipPicker;
