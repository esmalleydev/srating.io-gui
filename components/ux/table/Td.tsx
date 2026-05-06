'use client';

import { Objector, Style } from '@esmalley/ts-utils';

export interface TdProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'onClick' | 'style'> {
  onClick?: () => void;
  style?: React.CSSProperties | object; // Allows custom style objects alongside standard CSS properties
  children?: React.ReactNode;
}


const Td = (
  {
    // sortDirection = false,
    onClick,
    style = {},
    children,
    ...props
  }: TdProps,
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

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <td className = {Style.getStyleClassName(tdStyle)} onClick={handleClick} {...props}>
      {children}
    </td>
  );
};

export default Td;
