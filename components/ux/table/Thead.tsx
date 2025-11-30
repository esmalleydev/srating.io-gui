'use client';

import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';


const Thead = (
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
  const theadStyle = Objector.extender(
    {
      display: 'table-header-group',
    },
    style,
  );

  return (
    <thead className = {Style.getStyleClassName(theadStyle)} {...props}>
      {children}
    </thead>
  );
};

export default Thead;
