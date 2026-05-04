'use client';

import Typography from '@/components/ux/text/Typography';
import Divider from '@/components/ux/display/Divider';
import Columns from '@/components/ux/layout/Columns';
import Tile from '@/components/ux/container/Tile';
import { useTheme } from '@/components/ux/contexts/themeContext';
import CodeBlock from '@/components/ux/text/CodeBlock';
import TextFieldsIcon from '@esmalley/react-material-icons/TextFields';
import DownloadingIcon from '@esmalley/react-material-icons/Downloading';
import PhotoIcon from '@esmalley/react-material-icons/Photo';

export default function Page() {
  const theme = useTheme();

  return (
    <div style={{ maxWidth: '900px' }}>
      <Typography type="h5" style={{ marginBottom: 10 }}>
        UI Component library
      </Typography>
      <Typography type="body1" style={{ color: theme.text?.secondary, marginBottom: 30 }}>
        A collection of reusable, themed components built with React and TypeScript.
        Designed for consistency, accessibility, and speed.
      </Typography>

      <Divider />

      <section style={{ marginTop: 40 }}>
        <Typography type="h5">Installation</Typography>
        <Typography type="body2" style={{ marginTop: 10 }}>
          Install the core utilities and icon packages via your preferred package manager:
        </Typography>
        <CodeBlock code={'npm install @esmalley/ts-utils @esmalley/react-material-icons @esmalley/react-material-ui'} />
      </section>

      <section style={{ marginTop: 40 }}>
        <Typography type="h5">Core Principles</Typography>
        <div style={{ marginTop: 20 }}>
          <Columns numberOfColumns={2}>
            <div style={{ padding: '0 10px' }}>
              <Typography type="subtitle1" style={{ fontWeight: 'bold' }}>Theme Driven</Typography>
              <Typography type="body2">
                All components hook into a central Theme Context, allowing for instant light/dark mode switching and brand styling.
              </Typography>
            </div>
            <div style={{ padding: '0 10px' }}>
              <Typography type="subtitle1" style={{ fontWeight: 'bold' }}>Controlled Inputs</Typography>
              <Typography type="body2">
                Our Input system uses a custom <code>Inputs</code> handler to manage validation, formatting, and state out of the box.
              </Typography>
            </div>
          </Columns>
        </div>
      </section>

      <section style={{ marginTop: 40 }}>
        <Typography type="h5">Quick Navigation</Typography>
        <Typography type="body2" style={{ marginBottom: 20 }}>
          Jump straight into specific component categories:
        </Typography>
        <Columns numberOfColumns={3}>
          <Tile
            primary="Inputs"
            secondary="Text, Select, Pickers"
            icon = {<TextFieldsIcon style = {{ color: theme.info.main }} />}
            onClick={() => {
              window.location.href = '/ux/inputs';
            }}
          />
          <Tile
            primary="Feedback"
            secondary="Progress, Skeletons"
            icon = {<DownloadingIcon style = {{ color: theme.info.main }} />}
            onClick={() => {
              window.location.href = '/ux/loading';
            }}
          />
          <Tile
            primary="Icons"
            secondary="Material Design Icons"
            icon = {<PhotoIcon style = {{ color: theme.info.main }} />}
            onClick={() => {
              window.location.href = '/ux/icons';
            }}
          />
        </Columns>
      </section>

      <section style={{ marginTop: 60, padding: '20px', backgroundColor: theme.background.main, borderRadius: '8px' }}>
        <Typography type="h6">Usage Example</Typography>
        <CodeBlock code={`import { Button, Typography } from '@esmalley/react-material-icons';

const MyComponent = () => (
  <div>
    <Typography type="h1">Hello World</Typography>
    <Button title="Click Me" handleClick={() => alert('Clicked!')} />
  </div>
);`} />
      </section>
    </div>
  );
}
