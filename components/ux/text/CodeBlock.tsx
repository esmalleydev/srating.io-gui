import { Objector, toaster } from '@esmalley/ts-utils';
import { useTheme } from '../contexts/themeContext';
import Paper from '../container/Paper';
import { useEffect, useMemo, useRef, useState } from 'react';
import IconButton from '../buttons/IconButton';
import ContentCopyIcon from '@esmalley/react-material-icons/ContentCopy';
import Tooltip from '../overlay/Tooltip';

type SupportedLang = 'js' | 'ts' | 'sh' | 'py';

// --- Whitespace Fixer ---
const stripIndent = (rawCode: string): string => {
  const lines = rawCode.split('\n');
  if (lines[0]?.trim() === '') lines.shift();
  if (lines.length > 0 && lines[lines.length - 1]?.trim() === '') lines.pop();

  const minIndent = Math.min(
    ...lines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^ */)?.[0].length || 0),
  );

  return lines.map((line) => line.slice(minIndent)).join('\n');
};



const CodeBlock = (
  {
    code,
    lang = 'ts',
    style = {},
  }:
  {
    code: string;
    lang?: SupportedLang;
    style?: object;
  },
) => {
  const instanceId = useMemo(() => crypto.randomUUID(), []);
  const theme = useTheme();
  const textNodeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  // Clean the code before doing anything else
  const cleanCode = stripIndent(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopied(true);
      toaster.add('Copied!', 'success');
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      toaster.add('Failed to copy!', 'error');
      console.error('Failed to copy!', err);
    }
  };

  const keys = useMemo(() => ({
    keyword: `kw-${instanceId}`,
    string: `str-${instanceId}`,
    comment: `com-${instanceId}`,
    special: `spec-${instanceId}`,
  }), [instanceId]);

  const pStyle: Record<string, unknown> = {
    color: theme.mode === 'dark' ? theme.text.primary : '#fff',
    padding: '16px',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '100%',
    fontSize: '14px',
    margin: '16px 0',
    [`::highlight(${keys.keyword})`]: {
      color: theme.red[500],
      fontWeight: 'bold',
    },
    [`::highlight(${keys.string})`]: { color: theme.info.light },
    [`::highlight(${keys.comment})`]: { color: theme.grey[500] },
    [`::highlight(${keys.special})`]: { color: theme.green[500] },
  };

  if (theme.mode === 'light') {
    pStyle.backgroundColor = theme.grey[800];
  }

  Objector.extender(pStyle, style);

  // --- Language Specific Regex Logic ---
  const patterns = {
    common: {
      str: /(".+?"|'.+?'|`.+?`)/g,
      comment: /(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g,
    },
    js: {
      kw: /\b(const|let|var|function|return|if|else|import|export|from|class|await|async)\b/g,
      special: /(<\/?([A-Z][a-zA-Z0-9]*|[a-z][a-zA-Z0-9]*)|(?<=\s)\/>|(?<=\w)\/?>|>)/g,
    },
    py: {
      kw: /\b(def|class|return|if|elif|else|import|from|as|with|try|except|for|while|in|is|not|None|True|False)\b/g,
      special: /(@[a-zA-Z_][a-zA-Z0-9_]*)/g, // Decorators
    },
    sh: {
      kw: /\b(sudo|echo|export|if|then|fi|for|in|do|done|case|esac|alias)\b/g,
      special: /(-\w+|--[\w-]+)/g, // Flags/Arguments
    },
  };

  useEffect(() => {
    // Ensure the browser supports the API
    if (!('highlights' in CSS)) {
      console.warn('CSS.highlights not supported.');
      return;
    }

    const node = textNodeRef.current?.firstChild;
    if (!node || node.nodeType !== Node.TEXT_NODE) return;


    // Helper function to generate Ranges for a given Regex
    const createHighlight = (regex: RegExp) => {
      const ranges: Range[] = [];
      let match;
      while ((match = regex.exec(cleanCode)) !== null) {
        const range = new Range();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        ranges.push(range);
      }
      return new Highlight(...ranges);
    };

    let active = patterns.js;

    if (lang in patterns) {
      active = patterns[lang];
    }

    CSS.highlights.set(keys.keyword, createHighlight(active.kw));
    CSS.highlights.set(keys.special, createHighlight(active.special));
    CSS.highlights.set(keys.string, createHighlight(patterns.common.str));
    CSS.highlights.set(keys.comment, createHighlight(patterns.common.comment));

    // eslint-disable-next-line consistent-return
    return () => {
      Object.values(keys).forEach((k) => CSS.highlights.delete(k));
    };
  }, [cleanCode, lang, keys]);



  return (
    <Paper elevation={5} style={pStyle}>
      {/* Language Badge */}
      <div style={{
        textAlign: 'right',
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        opacity: 0.5,
        // color: '#fff',
        padding: '4px 8px',
        letterSpacing: '1px',
      }}>
        {lang.toUpperCase()}
      </div>
      <pre style={{ margin: 0, overflow: 'scroll' }}>
        {/* The raw text goes here. The browser paints the colors over it. */}
        <code ref={textNodeRef} style = {{ fontFamily: 'monospace' }}>{cleanCode}</code>
      </pre>
      <div style = {{ textAlign: 'right' }}>
        <Tooltip text = 'Copy'>
          <IconButton
            icon = {<ContentCopyIcon style = {{ fontSize: 20 }} />}
            value='copy'
            onClick={handleCopy}
          />
        </Tooltip>
      </div>
    </Paper>
  );
};

export default CodeBlock;
