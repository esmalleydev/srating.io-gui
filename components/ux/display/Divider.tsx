'use client';

import { useTheme } from '@/components/ux/contexts/themeContext';
import { Objector, Style } from '@esmalley/ts-utils';


const Divider = (
  {
    style = {},
  }:
  {
    style?: Record<string, unknown>;
  },
) => {
  const theme = useTheme();

  const hrStyle = { margin: 0, borderWidth: 0, borderStyle: 'solid', borderColor: theme.grey[600], borderBottomWidth: 'thin' };

  Objector.extender(hrStyle, style);

  return <hr className = {Style.getStyleClassName(hrStyle)} />;
};

export default Divider;
