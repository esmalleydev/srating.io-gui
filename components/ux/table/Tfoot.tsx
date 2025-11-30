'use client';

import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';


const Tfoot = (
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
  const tfootStyle = Objector.extender(
    {
      display: 'table-footer-group',
    },
    style,
  );

  return (
    <tfoot className = {Style.getStyleClassName(tfootStyle)} {...props}>
      {children}
    </tfoot>
  );
};

export default Tfoot;
