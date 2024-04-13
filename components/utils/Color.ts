import { useTheme } from '@mui/material/styles';

export const getBestColor: () => string = () => {
  const theme = useTheme();

  return theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.dark;
};

export const getWorstColor: () => string = () => {
  const theme = useTheme();

  return theme.palette.mode === 'light' ? theme.palette.error.main : theme.palette.error.dark;
};

export const getLogoColorPrimary: () => string = () => {
  const theme = useTheme();

  // return theme.palette.mode === 'light' ? '#fd35ab' : '#FDD835';
  return theme.palette.mode === 'light' ? theme.palette.warning.light : '#FDD835';
};

export const getLogoColorSecondary: () => string = () => {
  const theme = useTheme();

  return theme.palette.mode === 'light' ? '#482ab9' : '#2ab92a';
};


class Color {
  constructor() {
  };


  /**
   * A linear interpolator for hexadecimal colors
   * @param {string} a
   * @param {string} b
   * @param {number} amount
   * @example
   * // returns #7F7F7F
   * lerpColor('#000000', '#ffffff', 0.5)
   * @returns {string}
   */
  lerpColor(a: string, b: string, amount: number): string { 
    var ah = ah = +a.replace('#', '0x'),
      ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
      bh =  +b.replace('#', '0x'),
      br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
      rr = ar + amount * (br - ar),
      rg = ag + amount * (bg - ag),
      rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
  };


};

export default Color;