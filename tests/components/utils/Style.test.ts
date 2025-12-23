import Style from '@/components/utils/Style';

// todo the first test alwayss fails, the css isnt done loading yet??


describe('Style Class CSS Generation', () => {
  // Mock DOM elements
  let styleElement: { textContent: string };

  // Helper to strip whitespace for easier string comparison
  const normalize = (str: string) => str.replace(/\s+/g, ' ').trim();

  beforeEach(() => {
    // Reset Style cache before each test
    Style.flush();

    // Mock document.createElement and head.appendChild
    styleElement = { textContent: '' };

    global.document = {
      createElement: jest.fn().mockImplementation((tag) => {
        if (tag === 'style') return styleElement;
        return {};
      }),
      head: {
        appendChild: jest.fn(),
      },
      // Mock body if needed for other parts, though Style.ts mostly uses head
      body: {} as HTMLElement,
    };

    // @ts-expect-error -- Ensure window exists so Style thinks it's client-side
    global.window = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  test('should parse basic object properties and convert camelCase to kebab-case', () => {
    const css = {
      backgroundColor: 'red',
      marginTop: '10px',
      display: 'flex',
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

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
      lineHeight: 1.5, // numeric string with no unit might be treated differently depending on logic, but raw numbers usually get px if in list
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    expect(output).toContain('width: 100px;');
    expect(output).toContain('padding: 20px;');
    // Check properties that shouldn't have units
    expect(output).toContain('z-index: 5;');
    expect(output).toContain('opacity: 0.5;');
  });

  test('should handle raw strings inside object values even if they look like numbers', () => {
    const css = {
      margin: '0 auto', // Should not become "0px auto" or break
      flex: '1 1 auto',
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    expect(output).toContain('margin: 0 auto;');
    expect(output).toContain('flex: 1 1 auto;');
  });

  test('should strip quotes appropriately but keep them for content', () => {
    const css = {
      fontFamily: '"Arial", sans-serif', // Should strip outer quotes if logic dictates, or standard behavior
      content: '"hello"', // Should keep quotes (in requiresQuotes set)
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    // Based on logic: value.slice(1, -1) if not in requiresQuotes
    expect(output).toContain('font-family: Arial, sans-serif;'); 
    expect(output).toContain('content: "hello";');
  });

  // ==========================================
  // 2. Nested Selectors & Pseudo-classes
  // ==========================================

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
    // The cleanSelector logic removes the colon if it's trailing, but here it's :hover
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

  // ==========================================
  // 3. Media Queries (Recursive Logic)
  // ==========================================

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
    // Recursive logic wraps the classname inside the media query
    expect(output).toContain(`@media (min-width: 600px) { .${className} { width: 50%; } }`);
  });

  test('should handle nested selectors INSIDE @media queries (Regression Test)', () => {
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

    // Critical check: Ensure no extra trailing braces
    // (A sloppy regex check to ensure we don't see `} } }` at the end if we expect `} }`)
    expect(output.endsWith('}}}')).toBe(false);
  });

  test('should handle multiple levels of @media nesting properly', () => {
    // Standard CSS doesn't typically nest media inside media often,
    // but this validates the recursion robustness.
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

  // ==========================================
  // 4. Keyframes (Non-Recursive At-Rules)
  // ==========================================

  test('should handle @keyframes without injecting class names (Non-Recursive)', () => {
    const css = {
      animation: 'pop-in 0.2s',
      '@keyframes pop-in': {
        '0%': { transform: 'scale(0.8)', opacity: 0 },
        '100%': { transform: 'scale(1)', opacity: 1 },
      },
    };

    const className = Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    // Main class
    expect(output).toContain(`.${className} { animation: pop-in 0.2s; }`);

    // Keyframes:
    // 1. Should NOT contain the class name inside
    // 2. Should be properly formatted
    const expectedKeyframes = '@keyframes pop-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }';

    expect(output).toContain(expectedKeyframes);

    // Ensure we didn't inject the classname inside the keyframes
    // (e.g., @keyframes pop-in { .css-123 { ... } } would be wrong)
    const badPattern = `@keyframes pop-in { .${className}`;
    expect(output).not.toContain(badPattern);
  });

  test('should handle multiple @keyframes in one object', () => {
    const css = {
      '@keyframes fade-in': {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      '@keyframes slide-up': {
        from: { transform: 'translateY(10px)' },
        to: { transform: 'translateY(0)' },
      },
    };

    Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    expect(output).toContain('@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }');
    expect(output).toContain('@keyframes slide-up { from { transform: translateY(10px); } to { transform: translateY(0); } }');
  });

  test('Regression Check: Keyframes should not have extra trailing braces', () => {
    // This specifically tests the fix where "atRuleBraceCount === 0" was
    // including the closing brace in the content, leading to double brackets.
    const css = {
      '@keyframes spin': {
        '100%': { transform: 'rotate(360deg)' }
      },
    };

    Style.getStyleClassName(css);
    const output = normalize(styleElement.textContent);

    // Valid: @keyframes spin { 100% { transform: rotate(360deg); } }
    // Invalid: @keyframes spin { 100% { transform: rotate(360deg); } } }

    // Match the exact string end
    const expected = '@keyframes spin { 100% { transform: rotate(360deg); } }';
    expect(output).toContain(expected);

    // Sanity check the very end of the string (ignoring whitespace via normalize)
    // The previous test suite might output `... } } }` if broken.
    const endsWithTripleBrace = output.match(/}\s*}\s*}$/);
    expect(endsWithTripleBrace).toBeNull();
  });

  // ==========================================
  // 5. Complex Integration
  // ==========================================

  test('complex real-world example (Input Style)', () => {
    const inputStyle = {
      minWidth: '200px',
      backgroundColor: 'transparent',
      background: 'none',
      color: '#fff',
      padding: '8px 8px 8px calc(1em + 32px)',
      '&::placeholder': {
        opacity: 0.7,
        color: '#fff',
      },
      '&:focus-visible': {
        outline: 'none',
      },
      transition: 'width 300ms',
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

    // Check Placeholder
    expect(output).toContain(`.${className}::placeholder { opacity: 0.7; color: #fff; }`);

    // Check Focus Visible
    expect(output).toContain(`.${className}:focus-visible { outline: none; }`);

    // Check Media Query (Recursive part)
    const expectedMedia = `@media (min-width:600px) { .${className} { width: 200px; } .${className}:focus { width: 250px; } }`;
    expect(output).toContain(expectedMedia);
  });
});
