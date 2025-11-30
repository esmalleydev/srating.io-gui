'use client';

import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';


const Tr = (
  {
    onClick,
    style = {},
    children,
    ...props
  }:
  {
    onClick?: () => void,
    style?: object;
    children: React.ReactNode;
  },
) => {
  const trStyle = Objector.extender(
    {
      color: 'inherit',
      display: 'table-row',
      verticalAlign: 'middle',
      outline: '0',
      cursor: onClick ? 'pointer' : 'initial',
    },
    style,
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <tr className = {Style.getStyleClassName(trStyle)} onClick={handleClick} {...props}>
      {children}
    </tr>
  );
};

export default Tr;
