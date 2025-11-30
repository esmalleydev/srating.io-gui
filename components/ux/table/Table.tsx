'use client';

import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';
import Paper from '../container/Paper';


const Table = (
  {
    style = {},
    children,
    ...props
  }:
  {
    style?: object;
    children: React.ReactNode;
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

  return (
    <Paper style = {{ overflow: 'hidden' }}>
      <div style = {{ overflow: 'overlay' }}>
        <table className = {Style.getStyleClassName(tableStyle)} {...props}>
          {children}
        </table>
      </div>
    </Paper>
  );
};

export default Table;
