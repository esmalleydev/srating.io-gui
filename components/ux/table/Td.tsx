'use client';

import { Objector, Style } from '@esmalley/ts-utils';


const Td = (
  {
    // sortDirection = false,
    style = {},
    children,
    ...props
  }:
  {
    // sortDirection?: 'asc' | 'desc' | false;
    style?: object;
    children: React.ReactNode;
  },
) => {
  const tdStyle = Objector.extender(
    {
      fontSize: 12,
      lineHeight: '1.45',
      letterSpacing: '0.01071em',
      display: 'table-cell',
      textAlign: 'left',
      padding: '4px 5px',
      border: '0px solid',
    },
    style,
  );

  return (
    <td className = {Style.getStyleClassName(tdStyle)} {...props}>
      {children}
    </td>
  );
};

export default Td;
