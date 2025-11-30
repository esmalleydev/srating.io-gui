'use client';

import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';


const Tbody = (
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
  const tbodyStyle = Objector.extender(
    {
      display: 'table-row-group',
    },
    style,
  );

  return (
    <tbody className = {Style.getStyleClassName(tbodyStyle)} {...props}>
      {children}
    </tbody>
  );
};

export default Tbody;
