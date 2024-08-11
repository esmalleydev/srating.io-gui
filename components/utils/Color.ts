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
  }


  /**
   * A linear interpolator for hexadecimal colors
   * @param {string} a
   * @param {string} b
   * @param {number} amount
   * @example
   * // returns #7F7F7F
   * lerpColor('#000000', '#ffffff', 0.5)
   * @return {string}
   */
  public static lerpColor(a: string, b: string, amount: number): string {
    var ah = ah = +a.replace('#', '0x');
    const ar = ah >> 16; const ag = ah >> 8 & 0xff; const ab = ah & 0xff;
    const bh = +b.replace('#', '0x');
    const br = bh >> 16; const bg = bh >> 8 & 0xff; const bb = bh & 0xff;
    const rr = ar + amount * (br - ar);
    const rg = ag + amount * (bg - ag);
    const rb = ab + amount * (bb - ab);

    return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1)}`;
  }

  /**
   * Get a color that will look readable based on a background color
   * @param {string} color
   * @param {string} backgroundColor
   * @return {string} adjusted color hex
   */
  public static getTextColor(color: string, backgroundColor: string) {
    // Convert hex colors to RGB
    let [r1, g1, b1] = Color.hexToRgb(color);
    const [r2, g2, b2] = Color.hexToRgb(backgroundColor);

    const brightnessBg = Color.calculateBrightness(r2, g2, b2);

    const targetBrightness = brightnessBg > 128 ? 50 : 150; // target brightness threshold for contrast

    while (true) {
      const brightnessColor = Color.calculateBrightness(r1, g1, b1);

      if (
        (brightnessBg > 128 && brightnessColor < targetBrightness) ||
        (brightnessBg <= 128 && brightnessColor > targetBrightness)
      ) {
        break;
      }

      if (brightnessBg > 128) {
        r1 = Math.max(0, r1 - 25);
        g1 = Math.max(0, g1 - 25);
        b1 = Math.max(0, b1 - 25);
      } else {
        r1 = Math.min(255, r1 + 25);
        g1 = Math.min(255, g1 + 25);
        b1 = Math.min(255, b1 + 25);
      }

      if (r1 === 0 && g1 === 0 && b1 === 0 || r1 === 255 && g1 === 255 && b1 === 255) {
        break; // avoid infinite loop
      }
    }

    // Convert back to hex
    return Color.rgbToHex(r1, g1, b1);
  }


  /**
   * Are 2 colors similar to each other?
   * @param {string} color1
   * @param {string} color2
   * @param {number} threshold
   * @return {boolean}
   */
  public static areColorsSimilar(color1: string, color2: string, threshold = 50) {
    const distance = Color.colorDistance(color1, color2);
    return distance < threshold;
  }


  /**
   * Inverts a hex color
   * @param {string} hex
   * @return {string} hex
   */
  public static invertColor(hex: string) {
    const [r, g, b] = Color.hexToRgb(hex);

    // Invert each color component
    const invertedR = 255 - r;
    const invertedG = 255 - g;
    const invertedB = 255 - b;

    return Color.rgbToHex(invertedR, invertedG, invertedB);
  }


  /**
   * Gets analogous colors
   * @param {string} hex
   * @return {Array<string>}
   */
  public static getAnalogousColors(hex: string) {
    const [r, g, b] = Color.hexToRgb(hex);
    const [h, s, l] = Color.rgbToHsl(r, g, b);

    const analogousColors: string[] = [];
    const offset = 30; // Offset for analogous colors, usually 30 degrees

    for (let i = -1; i <= 1; i++) {
      if (i !== 0) {
        const newHue = (h + i * offset + 360) % 360;
        const [newR, newG, newB] = Color.hslToRgb(newHue, s, l);
        analogousColors.push(Color.rgbToHex(newR, newG, newB));
      }
    }

    return analogousColors;
  }


  /**
   * Convert hex to rgb
   * @param {string} hex
   * @return {Array} rgb
   */
  private static hexToRgb(hex: string): Array<number> {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, '');

    // Parse r, g, b values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
  }


  /**
   * Convert rgb to hex
   * @param {number} r
   * @param {number} g
   * @param {number} b
   * @return {string}
   */
  private static rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }

  private static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h; let s; const
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  }

  private static hslToRgb(h, s, l) {
    let r; let g; let
      b;
    h /= 360;
    s /= 100;
    l /= 100;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 3) return q;
        if (t < 1 / 2) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  private static calculateBrightness(r: number, g: number, b: number): number {
    // Calculate the brightness of the color
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  private static colorDistance(color1, color2) {
    const [r1, g1, b1] = Color.hexToRgb(color1);
    const [r2, g2, b2] = Color.hexToRgb(color2);

    const dr = r1 - r2;
    const dg = g1 - g2;
    const db = b1 - b2;

    return Math.sqrt(dr * dr + dg * dg + db * db);
  }
}

export default Color;
