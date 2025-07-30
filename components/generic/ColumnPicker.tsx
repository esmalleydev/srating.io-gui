'use client';

import OptionPicker from './OptionPicker';
import { TableColumnsType } from '../helpers/TableColumns';
import Chip from '../ux/container/Chip';


const ColumnPicker = (
  {
    options,
    selected,
    filled,
    actionHandler,
    firstRunAction,
    isRadio = false,
    autoClose = false,
  }:
  {
    options: TableColumnsType,
    selected: Array<string>,
    filled: boolean,
    actionHandler?: (value: string) => void,
    firstRunAction?: (columnView: string) => void,
    isRadio?: boolean,
    autoClose?: boolean,
  },
) => {
  // console.time('ColumnPicker')


  // useEffect(() => {
  //   console.timeEnd('ColumnPicker')
  // })


  const handleFirstRunAction = () => {
    if (!filled && firstRunAction) {
      firstRunAction('custom');
    }
  };


  const handleClick = (value: string) => {
    handleFirstRunAction();

    if (actionHandler) {
      actionHandler(value);
    }
  };



  return (
    <OptionPicker
      renderButton={(handleOpen, open) => {
        return (
          <Chip
            key = {'custom'}
            style = {{ margin: '5px' }}
            title={'+ Custom'}
            filled={filled}
            value = {'custom'}
            onClick={(e) => {
              // First, execute the handleOpen from OptionPicker
              handleOpen(e as React.MouseEvent<HTMLButtonElement>);
            }}
          />
        );
      }}
      options = {Object.values(options).map((r) => { return { value: r.id, label: r.label, sublabel: r.tooltip, disabled: r.disabled }; })}
      selected = {selected.length ? selected : [null]}
      actionHandler = {handleClick}
      isRadio = {isRadio}
      autoClose = {autoClose}
    />
  );
};

export default ColumnPicker;
