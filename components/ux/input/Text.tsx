'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';

const Text = (
  // {
  //   elevation = 3,
  //   style = {},
  //   children,
  // }:
  // {
  //   elevation?: number;
  //   style?: React.CSSProperties;
  //   children: React.ReactNode;
  // },
) => {
  const theme = useTheme();

  const color = theme.mode === 'dark' ? theme.info.light : theme.info.dark;

  // todo lerp color from background to grey for dark mode, based on elevation

  // const cStyle: React.CSSProperties = {
  //   borderRadius: 4,
  //   boxShadow: Style.getShadow(elevation),
  //   ...style,
  // };

  // return (
  //   <div style = {cStyle}>
  //     {children}
  //   </div>
  // );
};

export default Text;
