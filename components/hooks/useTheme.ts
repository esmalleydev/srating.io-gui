'use client';

import { useAppSelector } from '@/redux/hooks';
import Theme from '../utils/Theme';


export const useTheme = () => {
  const mode = useAppSelector((state) => state.themeReducer.mode);

  const theme = new Theme(mode).getTheme();

  return theme;
};
