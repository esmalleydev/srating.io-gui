import { Objector } from '@esmalley/ts-utils';
import { useTheme } from '../contexts/themeContext';
import Paper from '../container/Paper';


const CodeBlock = (
  {
    code,
    style = {},
  }:
  {
    code: string;
    style?: object;
  },
) => {
  const theme = useTheme();

  const pStyle: Record<string, unknown> = {
    color: theme.mode === 'dark' ? theme.text.primary : '#fff',
    padding: '16px',
    borderRadius: '8px',
    overflowX: 'auto',
    fontSize: '14px',
    margin: '16px 0',
  };

  if (theme.mode === 'light') {
    pStyle.backgroundColor = theme.grey[800];
  }

  Objector.extender(pStyle, style);

  return (
    <Paper elevation={5} style = {pStyle}>
      <pre>
        <code>{code}</code>
      </pre>
    </Paper>
  );
};

export default CodeBlock;
