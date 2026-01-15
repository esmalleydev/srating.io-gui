/* eslint-disable no-restricted-syntax */
/* eslint-disable no-bitwise */




type CSSMap = Map<string, string>;

/**
 * Class to get the style
 * Has base CSS functions
 */
class Style {
  public static getStyle() {
    return {
      zIndex: Style.getZIndex(),
    };
  }

  public static getZIndex() {
    return {
      appBar: 1100,
      drawer: 1200,
      fab: 1050,
      calendar: 1000,
      mobileStepper: 1000,
      modal: 1300,
      toast: 1400,
      speedDial: 1050,
      tooltip: 1500,
    };
  }

  public static getNavBar() {
    return {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      zIndex: Style.getZIndex().drawer,
      position: 'fixed',
      overflowX: 'scroll',
      overflowY: 'hidden',
      scrollbarWidth: 'none',
    };
  }

  public static getShadow(depth: number): string {
    const shadows = [
      'none',
      '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
      '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
      '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
      '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
      '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
      '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
      '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
      '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
      '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
      '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
      '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
      '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
      '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
      '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
      '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
      '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
      '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
      '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
      '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
      '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
      '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
    ];

    if (depth > shadows.length || depth < 0) {
      throw new Error(`min depth is 0, max depth is ${shadows.length}. Sent ${depth}`);
    }

    return shadows[depth];
  }

  /**
   *
   *
   *
   *
   * Below is all the CSS injection from js
   *
   *
   *
   */

  /**
   * Call this to add css as a style-sheet, so you can do css selectors like hover td {} etc
   */
  public static getStyleClassName(cssString: string | object, debug = false) {
    if (debug) {
      console.log('getStyleClassName', cssString);
    }
    // console.time('getStyleClassName')
    const className = `css-${this.hashCSS(cssString, debug)}`;

    this.injectStyle(className, cssString, debug);
    // console.timeEnd('getStyleClassName')
    return className;
  }

  // SSR helper to get all collected styles
  public static getCSS(): string {
    console.warn('this does not work yet, in root layout need to add a context thing so it attaches css to style when streamed from server');
    return Array.from(this.cssMap.values()).join('\n');
  }

  // Call after SSR render to clean up for next render
  public static flush(): void {
    this.styleCache.clear();
    this.cssMap.clear();
  }

  private static styleCache: Set<string> = new Set();

  private static cssMap: CSSMap = new Map(); // key: className, value: finalCSS

  private static hashCSS(css: string | object, debug = false) {
    const canonicalize = (obj: object): object => {
      if (typeof obj !== 'object' || obj === null) {
        // Return primitives as is
        return obj;
      }

      if (Array.isArray(obj)) {
        // Recursively canonicalize array elements
        return obj.map(canonicalize);
      }

      // 1. Get and sort the keys of the current object level
      const sortedKeys = Object.keys(obj).sort();
      const canonical: { [key: string]: unknown } = {};

      // 2. Build a new object using the sorted keys, and recursively process values
      for (const key of sortedKeys) {
        canonical[key] = canonicalize(obj[key]);
      }

      return canonical;
    };

    const normalize = (val: string | object): string => {
      if (typeof val === 'string') {
        return val;
      }
      if (typeof val === 'object' && val !== null) {
        const canonicalObject = canonicalize(val);
        // Step B: Stringify the canonical object without a replacer
        return JSON.stringify(canonicalObject);
      }
      return String(val);
    };

    const normalizedInput = normalize(css);

    if (debug) {
      console.log('normalizedInput', normalizedInput);
    }

    // Example hash using a simple DJB2 hash (or use a stronger hash like SHA-1/MD5 if needed)
    let hash = 5381;
    for (let i = 0; i < normalizedInput.length; i++) {
      hash = (hash * 33) ^ normalizedInput.charCodeAt(i);
    }
    return (hash >>> 0).toString(36); // base36 for short string
  }

  private static injectStyle(className: string, css: string | object, debug = false): void {
    if (
      this.styleCache.has(className)
    ) {
      return;
    }

    const finalCSS = this.processCSS(className, css, false, debug);

    // If on server, store it only
    if (typeof window === 'undefined') {
      this.cssMap.set(className, finalCSS);
    } else {
      const styleEl = document.createElement('style');
      styleEl.textContent = finalCSS;
      document.head.appendChild(styleEl);
    }

    this.styleCache.add(className);
    this.cssMap.set(className, finalCSS);
  }

  private static processCSS(className: string, css: string | object, isRecursive = false, debug = false): string {
    // Helper: remove trailing colon from selectors (e.g. 'td:' -> 'td')
    const cleanSelector = (sel:string): string => {
      return sel.replace(/:$/g, '');
    };

    // Convert camelCase to kebab-case for property names
    const toKebabCase = (str: string): string => {
      return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    };

    // Helper: Remove the specific '}' that closed the block from the accumulated lines
    // so we don't duplicate it when wrapping the result in new braces.
    const removeLastBrace = (lines: string[]) => {
      if (lines.length === 0) return;
      const lastIdx = lines.length - 1;
      const lastLine = lines[lastIdx];

      const braceIdx = lastLine.lastIndexOf('}');
      if (braceIdx !== -1) {
        // Remove the brace
        const newLine = lastLine.substring(0, braceIdx) + lastLine.substring(braceIdx + 1);

        // If the line is now empty (or just whitespace), remove it entirely
        if (!newLine.trim()) {
          lines.pop();
        } else {
          // eslint-disable-next-line no-param-reassign
          lines[lastIdx] = newLine;
        }
      }
    };

    const requiresQuotes = new Set([
      'content',
      'quotes',
      'cue',
      'cue-before',
      'cue-after',
      'src',
    ]);

    // List of properties that should have units if the value is a number
    const lengthProps = new Set([
      'width', 'height', 'top', 'left', 'right', 'bottom',
      'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'font-size', 'border-width', 'border-radius', 'gap', 'column-gap', 'row-gap',
      'min-width', 'min-height', 'max-width', 'max-height',
    ]);

    const non_recursive_at_rules = [
      '@keyframes',
      '@-webkit-keyframes',
      '@font-face',
      '@counter-style',
    ];

    const isNonRecursiveRule = (ruleName: string) => {
      return non_recursive_at_rules.some((prefix) => ruleName.startsWith(prefix));
    };

    const normalizeValue = (property: string, value: string | number): string | number => {
      if (!lengthProps.has(property)) {
        return value;
      }

      // If it's a number, add px
      if (typeof value === 'number') {
        return `${value}px`;
      }

      // If it's a numeric string with no unit, add px
      if (typeof value === 'string') {
        const trimmed = value.trim();

        // Match numeric string (integer or decimal), no unit
        if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
          return `${trimmed}px`;
        }

        // If it ends in known units or keywords, leave it alone
        return trimmed;
      }

      return value;
    };

    // Convert a line like "backgroundColor: red;" to "background-color: red;"
    const normalizeCSSLine = (line: string): string => {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) {
        return line; // Not a CSS property line
      }

      const rawProperty = line.slice(0, colonIndex).trim();
      let value: string | number = line.slice(colonIndex + 1).trim();

      const property = toKebabCase(rawProperty);

      // Remove trailing comma
      if (value.endsWith(',')) {
        value = value.slice(0, -1).trim();
      }

      // Only strip quotes if it's NOT a property like 'content'
      if (!requiresQuotes.has(property)) {
        // Strip leading/trailing double or single quotes
        // This handles: "Arial" -> Arial or 'Arial' -> Arial
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
      }

      value = normalizeValue(property, value);

      let cssLine = `${property}: ${value}`;
      if (!cssLine.endsWith(';')) {
        cssLine += ';';
      }

      return cssLine;
    };

    // Convert CSS object into flat lines
    const objectToLines = (obj: object): string[] => {
      const lines: string[] = [];

      for (const key in obj) {
        const value = obj[key];

        if (typeof value === 'object' && value !== null) {
          lines.push(`${key} {`);
          const nested = objectToLines(value);
          lines.push(...nested);
          lines.push('}');
        } else {
          // Note:
          // - We add a comma here to support object syntax, normalizeCSSLine will handle removing it and adding semicolons later.
          // - Don't stringify strings, to avoid double-escaping quotes (e.g. content: '"*"')
          const finalValue = typeof value === 'string' ? value : String(value);
          lines.push(`${key}: ${finalValue},`);
        }
      }

      return lines;
    };

    // Prepare raw lines
    const lines = typeof css === 'string'
      ? css.trim().split('\n').map((line) => line.trim()).filter(Boolean)
      : objectToLines(css);


    const topLevelRules: string[] = [];
    const nestedRules: string[] = [];
    const atRules: string[] = [];

    let currentNestedSelector: string | null = null;
    let insideNestedBlock = false;
    let nestedBlockLines: string[] = [];

    let currentAtRule: string | null = null;
    let insideAtRule = false;
    let atRuleLines: string[] = [];
    let atRuleBraceCount = 0;

    // if (debug) {
    //   console.log('lines', lines)
    // }

    // eslint-disable-next-line no-restricted-syntax
    for (const line of lines) {
      // PRIORITY 1: If we are actively collecting an At-Rule (@media), we consume EVERYTHING
      // until braces balance. We do NOT check for '&' or property types here, because
      // they belong to the recursive scope.
      if (insideAtRule) {
        // Do not normalize here, accumulate raw lines
        atRuleLines.push(line);

        // Count braces to track nesting depth
        atRuleBraceCount += (line.match(/{/g) || []).length;
        atRuleBraceCount -= (line.match(/}/g) || []).length;

        // When we've closed all braces, the at-rule is complete
        if (atRuleBraceCount === 0) {
          removeLastBrace(atRuleLines);
          // Recursively process the content inside the media query
          if (currentAtRule && isNonRecursiveRule(currentAtRule)) {
            const normalizedBlock = atRuleLines.map((l) => normalizeCSSLine(l)).join('\n');
            atRules.push(`${currentAtRule} {\n${normalizedBlock}\n}`);
          } else {
            const innerCSS = this.processCSS(className, atRuleLines.join('\n'), false, debug);
            // if (debug) {
            //   console.log('innerCSS', innerCSS)
            // }
            atRules.push(`${currentAtRule} { ${innerCSS} }`);
          }
          currentAtRule = null;
          insideAtRule = false;
          atRuleLines = [];
        }
        continue;
      }

      // PRIORITY 2: If we are inside a generic nested block (like &:focus), consume lines
      if (insideNestedBlock) {
        if (line.includes('}')) {
          // end nested block
          insideNestedBlock = false;
          const beforeBrace = line.split('}')[0].trim();
          // if (debug) {
          //   console.log('beforeBrace', beforeBrace)
          // }
          if (beforeBrace) {
            nestedBlockLines.push(normalizeCSSLine(beforeBrace));
          }

          if (currentNestedSelector) {
            // if (debug) {
            //   console.log('nestedBlockLines', nestedBlockLines)
            // }
            nestedRules.push(`${cleanSelector(currentNestedSelector)} { ${nestedBlockLines.join(' ')} }`);
          }

          currentNestedSelector = null;
          nestedBlockLines = [];
        } else {
          nestedBlockLines.push(normalizeCSSLine(line));
        }
        continue;
      }

      // PRIORITY 3: Start of a new At-Rule
      if (line.startsWith('@')) {
        // Start of at-rule
        const atRulePart = line.split('{')[0].trim();
        currentAtRule = atRulePart;
        atRuleLines = [];

        if (line.includes('{')) {
          insideAtRule = true;
          atRuleBraceCount = 1;

          // Add rest of line after '{' if any
          const afterBrace = line.split('{').slice(1).join('{').trim();
          if (afterBrace) {
            // Do not normalize here, keep raw line for recursive processing
            atRuleLines.push(afterBrace);

            // Check if there are closing braces on same line
            atRuleBraceCount += (afterBrace.match(/{/g) || []).length;
            atRuleBraceCount -= (afterBrace.match(/}/g) || []).length;

            if (atRuleBraceCount === 0) {
              removeLastBrace(atRuleLines);
              // Recursively process the content inside the media query

              if (isNonRecursiveRule(currentAtRule)) {
                const normalizedBlock = atRuleLines.map((l) => normalizeCSSLine(l)).join('\n');
                atRules.push(`${currentAtRule} {\n${normalizedBlock}\n}`);
              } else {
                // Pass isRecursive=false to wrap inner properties with the classname
                const innerCSS = this.processCSS(className, atRuleLines.join('\n'), false, debug);
                if (debug) {
                  console.log('innerCSS 2', innerCSS);
                }
                atRules.push(`${currentAtRule} { ${innerCSS} }`);
              }
              currentAtRule = null;
              insideAtRule = false;
              atRuleLines = [];
            }
          }
        }
        continue;
      }

      // PRIORITY 4: Start of a new Nested Selector
      if (line.startsWith('&')) {
        // Start of nested selector
        if (currentNestedSelector && nestedBlockLines.length) {
          nestedRules.push(`${cleanSelector(currentNestedSelector)} { ${nestedBlockLines.join(' ')} }`);
        }

        // Start new nested selector (grab until first '{' or whole line)
        const selectorPart = line.split('{')[0].trim();
        currentNestedSelector = selectorPart;
        nestedBlockLines = [];

        if (line.includes('{')) {
          insideNestedBlock = true;
          // Add rest of line after '{' if any
          const afterBrace = line.split('{').slice(1).join('{').trim();
          if (afterBrace) {
            nestedBlockLines.push(normalizeCSSLine(afterBrace));
          }
        }
        continue;
      }

      // PRIORITY 5: Standard property
      topLevelRules.push(normalizeCSSLine(line));
    }

    // Close any remaining nested block
    if (insideNestedBlock && currentNestedSelector && nestedBlockLines.length) {
      // if (debug) {
      //   console.log('nestedBlockLines', nestedBlockLines)
      // }
      // if (debug) console.log('zzzzz2', `${cleanSelector(currentNestedSelector)} { ${nestedBlockLines.join(' ')} }`)
      nestedRules.push(`${cleanSelector(currentNestedSelector)} { ${nestedBlockLines.join(' ')} }`);
    }

    // Handle edge case where atRule is unfinished (though valid CSS usually isn't)
    if (currentAtRule && atRuleLines.length) {
      if (isNonRecursiveRule(currentAtRule)) {
        const normalizedBlock = atRuleLines.map((l) => normalizeCSSLine(l)).join('\n');
        atRules.push(`${currentAtRule} {\n${normalizedBlock}\n}`);
      } else {
        const innerCSS = this.processCSS(className, atRuleLines.join('\n'), false, debug);
        atRules.push(`${currentAtRule} { ${innerCSS} }`);
      }
    }

    // if (debug) {
    //   console.log('topLevelRules', topLevelRules)
    // }

    // Compose final CSS:
    // Only generate top-level block if it's not recursive AND has actual rules
    // (If isRecursive is true, we just return the unwrapped rules, expecting the caller to wrap them if needed.
    // But our recursive calls for media queries now use isRecursive=false, so this logic mostly affects the very root call.)
    const topLevelCSS = (!isRecursive && topLevelRules.length > 0)
      ? `.${className} { ${topLevelRules.join(' ')} }`
      : topLevelRules.join(' '); // If recursive, return raw properties

    // Replace & in nested rules with .classname
    const nestedCSS = nestedRules.map((rule) => rule.replace(/&/g, `.${className}`)).join(' ');

    // atRules already contain full CSS blocks thanks to recursion, but we need to ensure inner & replacement happened
    // The recursion already handles replacement of & with .classname inside the recursive call!
    // So we just join them.
    const atCSS = atRules.join(' ');

    // if (debug) {
    //   console.log('atRules', atRules);
    // }

    const finalCSS = `${topLevelCSS} ${nestedCSS} ${atCSS}`.trim();

    return finalCSS;
  }
}

export default Style;

