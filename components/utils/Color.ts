/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */

import { useTheme } from '../hooks/useTheme';


export const getBestColor: () => string = () => {
  const theme = useTheme();

  return theme.mode === 'light' ? theme.success.main : theme.success.dark;
};

export const getWorstColor: () => string = () => {
  const theme = useTheme();

  return theme.mode === 'light' ? theme.error.main : theme.error.dark;
};

export const getLogoColorPrimary: () => string = () => {
  const theme = useTheme();

  // return theme.mode === 'light' ? '#fd35ab' : '#FDD835';
  return theme.mode === 'light' ? theme.warning.light : '#FDD835';
};

export const getLogoColorSecondary: () => string = () => {
  const theme = useTheme();

  return theme.mode === 'light' ? '#482ab9' : '#2ab92a';
};


class Color {
  // constructor() {
  // }


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
    const ah = +a.replace('#', '0x');
    const ar = ah >> 16;
    const ag = ah >> 8 & 0xff;
    const ab = ah & 0xff;

    const bh = +b.replace('#', '0x');
    const br = bh >> 16;
    const bg = bh >> 8 & 0xff;
    const bb = bh & 0xff;

    const rr = ar + amount * (br - ar);
    const rg = ag + amount * (bg - ag);
    const rb = ab + amount * (bb - ab);

    return `#${((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1)}`;
  }

  /**
   * Get a color that will look readable based on a background color
   */
  public static getTextColor(color: string, backgroundColor: string, debug = false) {
    // Convert hex colors to RGB
    /*
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

      if ((r1 === 0 && g1 === 0 && b1 === 0) || (r1 === 255 && g1 === 255 && b1 === 255)) {
        break; // avoid infinite loop
      }
    }

    // Convert back to hex
    return Color.rgbToHex(r1, g1, b1);
    */
    let [r, g, b] = Color.hexToRgb(color);
    const [br, bg, bb] = Color.hexToRgb(backgroundColor);
    const contrastTarget = 4.5;

    if (debug) {
      console.log('Color.getContrastRatio([r, g, b], [br, bg, bb])', Color.getContrastRatio([r, g, b], [br, bg, bb]));
    }

    if (Color.getContrastRatio([r, g, b], [br, bg, bb]) >= contrastTarget) {
      return Color.rgbToHex(r, g, b);
    }

    const contrastToBlack = Color.getContrastRatio([0, 0, 0], [br, bg, bb]);
    const contrastToWhite = Color.getContrastRatio([255, 255, 255], [br, bg, bb]);

    const direction: 'lighter' | 'darker' =
      contrastToWhite > contrastToBlack ? 'lighter' : 'darker';


    if (debug) {
      console.log('contrastToBlack', contrastToBlack);
      console.log('contrastToWhite', contrastToWhite);
      console.log('direction', direction);
    }

    const adjust = (c: number, lighter: boolean) => {
      return lighter ? Math.min(255, c + 10) : Math.max(0, c - 10);
    };

    for (let i = 0; i < 25; i++) {
      r = adjust(r, direction === 'lighter');
      g = adjust(g, direction === 'lighter');
      b = adjust(b, direction === 'lighter');

      if (debug) {
        console.log('Color.getContrastRatio([r, g, b], [br, bg, bb]) 2', Color.getContrastRatio([r, g, b], [br, bg, bb]));
      }

      if (Color.getContrastRatio([r, g, b], [br, bg, bb]) >= contrastTarget) {
        break;
      }
    }

    return Color.rgbToHex(r, g, b);
  }

  public static getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
    const luminance = (r: number, g: number, b: number): number => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928
          ? v / 12.92
          : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const lum1 = luminance(...rgb1) + 0.05;
    const lum2 = luminance(...rgb2) + 0.05;

    return lum1 > lum2 ? lum1 / lum2 : lum2 / lum1;
  }

  /**
   * Take a hex (#fff) and an amount and darken the color, return a hex
   * @param {string} hex
   * @param {number} amount
   * @return {string} hex
   */
  // public static darken(hex: string, amount: number = 0.02): string {
  //   const [r, g, b] = this.hexToRgb(hex);
  //   const [h, s, l] = this.rgbToHsl(r, g, b);

  //   const newL = Math.max(0, (l / 100) - amount) * 100;
  //   const [r2, g2, b2] = this.hslToRgb(h, s, newL);

  //   return this.rgbToHex(r2, g2, b2);
  // }

  /**
   * Take a hex (#fff) and an amount and lighten the color, return a hex
   * @param {string} hex
   * @param {number} amount
   * @return {string} hex
   */
  // public static lighten(hex: string, amount: number = 0.02): string {
  //   const [r, g, b] = this.hexToRgb(hex);
  //   const [h, s, l] = this.rgbToHsl(r, g, b);

  //   const newL = Math.min(1, (l / 100) + amount) * 100;
  //   const [r2, g2, b2] = this.hslToRgb(h, s, newL);

  //   return this.rgbToHex(r2, g2, b2);
  // }

  /**
   * Mixes the color with black to create a Shade.
   * Prevents the "muddy/brown" look of HSL darkening.
   * @param {string} hex - The color to darken
   * @param {number} amount - 0 to 1 (e.g. 0.1 is 10% darker)
   * @return {string} hex
   */
  public static darken(hex: string, amount: number = 0.1): string {
    const [r, g, b] = this.hexToRgb(hex);

    // Calculate new color by mixing with black (0)
    // Formula: Current * (1 - amount)
    const remaining = 1 - amount;
    const r2 = Math.round(r * remaining);
    const g2 = Math.round(g * remaining);
    const b2 = Math.round(b * remaining);

    return this.rgbToHex(r2, g2, b2);
  }

  /**
   * Mixes the color with white to create a Tint.
   * cleaner and less "washed out" than HSL lightness adjustment.
   * @param {string} hex - The color to lighten
   * @param {number} amount - 0 to 1 (e.g. 0.1 is 10% lighter)
   * @return {string} hex
   */
  public static lighten(hex: string, amount: number = 0.1): string {
    const [r, g, b] = this.hexToRgb(hex);

    // Calculate new color by mixing with white (255)
    // Formula: Current + ((Target - Current) * amount)
    const r2 = Math.round(r + (255 - r) * amount);
    const g2 = Math.round(g + (255 - g) * amount);
    const b2 = Math.round(b + (255 - b) * amount);

    return this.rgbToHex(r2, g2, b2);
  }


  public static shadeColor(hex: string, percent: number) {
    let [r, g, b] = Color.hexToRgb(hex);

    r = Math.min(255, Math.max(0, Math.round(r + (r * (percent / 100)))));
    g = Math.min(255, Math.max(0, Math.round(g + (g * (percent / 100)))));
    b = Math.min(255, Math.max(0, Math.round(b + (b * (percent / 100)))));

    return Color.rgbToHex(r, g, b);
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
   * Takes a hex (#fff) and returns an rgba with the provided alpha
   * @param {string} hex
   * @param {number} alpha
   * @return {string} rgba()
   */
  public static alphaColor(hex: string, alpha: number): string {
    const [r, g, b] = this.hexToRgb(hex);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
  public static hexToRgb(hex: string): Array<number> {
    // Remove the hash at the start if it's there
    let h = hex.replace(/^#/, '');

    // Handle 3-character hex codes by expanding them to 6-character
    if (h.length === 3) {
      h = h.split('').map((char) => { return char + char; }).join('');
    }

    // Ensure it's a valid 6-character hex code
    if (h.length !== 6) {
      throw new Error(`Invalid hex color format: ${hex}`);
    }

    // Parse r, g, b values
    const bigint = parseInt(h, 16);
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
    let r;
    let g;
    let b;
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
