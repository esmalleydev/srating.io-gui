'use client';

import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';
import Paper from '../container/Paper';



const Table = (
  {
    style = {},
    overlayStyle = {},
    children,
    ref,
    ...props
  }:
  {
    style?: object;
    overlayStyle?: object;
    children: React.ReactNode;
    ref?: React.Ref<HTMLTableElement>;
  },
) => {
  const tableStyle = Objector.extender(
    {
      display: 'table',
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      // borderRadius: '4px',
      // border: `1px solid ${theme.background.main}`,
    },
    style,
  );

  const oStyle = Objector.extender(
    {
      overflow: 'overlay',
    },
    overlayStyle,
  );

  return (
    <Paper style = {{ overflow: 'hidden' }}>
      <div className = {Style.getStyleClassName(oStyle)}>
        <table ref = {ref} className = {Style.getStyleClassName(tableStyle)} {...props}>
          {children}
        </table>
      </div>
    </Paper>
  );
};

export default Table;
