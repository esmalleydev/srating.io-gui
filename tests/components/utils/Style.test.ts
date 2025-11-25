import Style from '@/components/utils/Style';

// todo the first test alwayss fails, the css isnt done loading yet??


describe('Style Class CSS Generation', () => {
  // Mock DOM elements
  let styleElement: { textContent: string };

  beforeEach(() => {
    // Reset Style cache before each test
    Style.flush();

    // Mock document.createElement and head.appendChild
    styleElement = { textContent: '' };

    // @ts-ignore
    global.document = {
      createElement: jest.fn().mockReturnValue(styleElement),
      head: {
        appendChild: jest.fn(),
      },
    };
  });

  // Helper to strip whitespace for easier string comparison
  const normalize = (str: string) => str.replace(/\s+/g, ' ').trim();

  test('should parse basic object properties and convert camelCase to kebab-case', () => {
    const css = {
      backgroundColor: 'red',
      marginTop: '10px',
      display: 'flex',
    };

    const className = Style.getStyleClassName(css);
    const output = styleElement.textContent;

    // Verify class name exists
    expect(output).toContain(`.${className}`);

    // Verify properties exist individually (ignores order)
    expect(output).toContain('background-color: red;');
    expect(output).toContain('margin-top: 10px;');
    expect(output).toContain('display: flex;');
  });


  test('should add px units to numeric values for specific properties', () => {
    const css = {
      width: 100,
      padding: 20,
      zIndex: 5, // zIndex is NOT in lengthProps, should remain 5
      opacity: 0.5, // opacity is NOT in lengthProps
    };

    const className = Style.getStyleClassName(css);
    const output = styleElement.textContent;


    expect(output).toContain('width: 100px;');
    expect(output).toContain('padding: 20px;');
    // Check properties that shouldn't have units
    expect(output).toContain('z-index: 5;');
    expect(output).toContain('opacity: 0.5;');
  });

  test('should handle simple nested selectors (pseudo-classes)', () => {
    const css = {
      color: 'blue',
      '&:hover': {
        color: 'red',
      },
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    const expectedMain = `.${className} { color: blue; }`;
    const expectedHover = `.${className}:hover { color: red; }`;

    expect(output).toContain(expectedMain);
    expect(output).toContain(expectedHover);
  });

  test('should handle pseudo-elements', () => {
    const css = {
      '&::before': {
        content: '"*"',
        display: 'block',
      },
      '&::placeholder': {
        opacity: 1,
      },
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    expect(output).toContain(`.${className}::before { content: "*"; display: block; }`);
    expect(output).toContain(`.${className}::placeholder { opacity: 1; }`);
  });

  test('should handle string CSS input', () => {
    const cssString = `
      color: green;
      font-size: 16px;
      &:focus {
        outline: none;
      }
    `;

    const className = Style.getStyleClassName(cssString);
    const output = normalize(styleElement.textContent);

    expect(output).toContain(`.${className} { color: green; font-size: 16px; }`);
    expect(output).toContain(`.${className}:focus { outline: none; }`);
  });

  test('should handle basic @media queries', () => {
    const css = {
      width: '100%',
      '@media (min-width: 600px)': {
        width: '50%',
      },
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    expect(output).toContain(`.${className} { width: 100%; }`);
    // Note: The logic generates: @media (...) { .classname { ... } }
    expect(output).toContain(`@media (min-width: 600px) { .${className} { width: 50%; } }`);
  });

  test('should handle nested selectors INSIDE @media queries (The Fix)', () => {
    const css = {
      width: '100px',
      '@media (min-width: 600px)': {
        width: '200px',
        '&:focus': {
          width: '250px',
          backgroundColor: 'yellow',
        },
      },
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    // 1. Check top level
    expect(output).toContain(`.${className} { width: 100px; }`);

    // 2. Check inside media query
    // The recursive processCSS should generate:
    // .classname { width: 200px; } .classname:focus { width: 250px; background-color: yellow; }
    // Wrapped inside the media block.

    const expectedMediaBlock = `@media (min-width: 600px) { .${className} { width: 200px; } .${className}:focus { width: 250px; background-color: yellow; } }`;

    expect(output).toContain(expectedMediaBlock);
  });

  test('should handle multiple levels of @media nesting properly', () => {
    // This tests if the recursion logic holds up for standard recursion
    // (Though standard CSS doesn't usually nest media inside media,
    // this validates the robustness of the generic nested block handler)
    const css = {
      '@media screen': {
        color: 'red',
        '@media (min-width: 900px)': {
          color: 'blue',
        },
      },
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    // Recursion level 1
    expect(output).toContain(`@media screen { .${className} { color: red; }`);
    // Recursion level 2
    expect(output).toContain(`@media (min-width: 900px) { .${className} { color: blue; } }`);
  });

  test('should strip quotes appropriately but keep them for content', () => {
    const css = {
      // Should strip quotes
      fontFamily: '"Arial", sans-serif',
      // Should keep quotes (in requiresQuotes set)
      content: '"hello"',
    };

    const className = Style.getStyleClassName(css);
    const output = styleElement.textContent;

    expect(output).toContain('font-family: Arial, sans-serif;');
    expect(output).toContain('content: "hello";');
  });

  test('should handle raw strings inside object values that look like numbers', () => {
    const css = {
      margin: '0 auto', // Should not become 0px auto
      flex: '1 1 auto',
    };

    const className = Style.getStyleClassName(css);
    const output = styleElement.textContent;

    expect(output).toContain('margin: 0 auto;');
    expect(output).toContain('flex: 1 1 auto;');
  });

  test('complex real-world example (Input Style)', () => {
    const inputStyle = {
      minWidth: '200px',
      backgroundColor: 'transparent',
      background: 'none',
      color: '#fff',
      font: 'inherit',
      letterSpacing: 'inherit',
      border: 0,
      margin: 0,
      padding: '8px 8px 8px calc(1em + 32px)',
      '&::placeholder': {
        opacity: 0.7,
        color: '#fff',
      },
      '&:focus-visible': {
        outline: 'none',
      },
      transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      width: '100%',
      '@media (min-width:600px)': {
        width: '200px',
        '&:focus': {
          width: '250px',
        },
      },
    };

    const className = Style.getStyleClassName(inputStyle);
    const output = normalize(styleElement.textContent);

    // Check Root
    expect(output).toContain(`.${className} { min-width: 200px; background-color: transparent;`);
    expect(output).toContain('padding: 8px 8px 8px calc(1em + 32px);');

    // Check Placeholder
    expect(output).toContain(`.${className}::placeholder { opacity: 0.7; color: #fff; }`);

    // Check Focus Visible
    expect(output).toContain(`.${className}:focus-visible { outline: none; }`);

    // Check Media Query (The critical recursive part)
    const expectedMedia = `@media (min-width:600px) { .${className} { width: 200px; } .${className}:focus { width: 250px; } }`;
    expect(output).toContain(expectedMedia);
  });
});
