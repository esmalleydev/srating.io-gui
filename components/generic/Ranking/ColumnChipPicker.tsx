'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetDataKey, setDataKey } from '@/redux/features/ranking-slice';
import ColumnPicker from '../ColumnPicker';
import Organization from '@/components/helpers/Organization';
import Text from '@/components/utils/Text';
import Chip from '@/components/ux/container/Chip';
import TableColumns from '@/components/helpers/TableColumns';
import { getStore } from '@/app/StoreProvider';

export const getAvailableChips = ({ organization_id, view }) => {
  let availableChips = ['composite'];

  if (Organization.getCBBID() === organization_id) {
    if (view !== 'coach') {
      availableChips = availableChips.concat(['offense', 'defense']);
    }
  }

  if (Organization.getCFBID() === organization_id) {
    if (view !== 'coach') {
      availableChips = availableChips.concat(['passing', 'rushing']);
    }
  }

  return availableChips;
};



const ColumnChipPicker = ({ organization_id, view }) => {
  const dispatch = useAppDispatch();
  const columnView = useAppSelector((state) => state.rankingReducer.columnView);
  const customColumns = useAppSelector((state) => state.rankingReducer.customColumns);

  const headCells = TableColumns.getColumns({ organization_id, view });

  const handleCustomColumns = (value: string) => {
    const newColumns = [...customColumns];

    const index = newColumns.indexOf(value);

    if (index !== -1) {
      newColumns.splice(index, 1);
    } else {
      newColumns.push(value);
    }

    const store = getStore();
    dispatch(setDataKey({ key: 'customColumns', value: newColumns }));
    // dispatch(updateConferences(value));
    const results = store.getState().rankingReducer.customColumns;

    const current = new URLSearchParams(window.location.search);
    if (results.length) {
      current.delete('customColumns');
      for (let i = 0; i < results.length; i++) {
        current.append('customColumns', results[i]);
      }
    } else {
      current.delete('customColumns');
    }

    window.history.replaceState(null, '', `?${current.toString()}`);

    // use pushState if we want to add to back button history
    // window.history.pushState(null, '', `?${current.toString()}`);
    // console.timeEnd('ColumnPicker.handleClick');
  };

  const handleRankingView = (value: string) => {
    dispatch(setDataKey({ key: 'columnView', value }));
    dispatch(resetDataKey('customColumns'));

    const current = new URLSearchParams(window.location.search);

    if (value) {
      current.set('columnView', value);
      current.delete('customColumns');
    } else {
      current.delete('columnView');
    }

    window.history.replaceState(null, '', `?${current.toString()}`);

    // use pushState if we want to add to back button history
    // window.history.pushState(null, '', `?${current.toString()}`);
  };

  const getChips = () => {
    const chips: React.JSX.Element[] = [];

    const availableChips = getAvailableChips({ organization_id, view });

    availableChips.forEach((value) => {
      chips.push(
        <Chip key = {value} style = {{ margin: '5px' }} title={Text.toSentenceCase(value)} filled={(columnView === value)} value = {value} onClick={() => handleRankingView(value)} />,
      );
    });

    return chips;
  };

  return (
    <div style = {{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      {getChips()}
      <ColumnPicker
        key = {view}
        filled = {(columnView === 'custom')}
        options = {headCells}
        selected = {customColumns}
        actionHandler = {handleCustomColumns}
        firstRunAction = {handleRankingView}
      />
    </div>
  );
};

export default ColumnChipPicker;
