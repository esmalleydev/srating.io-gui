'use client';

import Divider from '@/components/ux/display/Divider';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import CodeBlock from '@/components/ux/text/CodeBlock';
import { Textor } from '@esmalley/ts-utils';


export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>Typography</Typography>

      <Columns numberOfColumns={6} style = {{ alignItems: 'center' }}>
        <Typography type='h1'>h1</Typography>
        <Typography type='h2'>h2</Typography>
        <Typography type='h3'>h3</Typography>
        <Typography type='h4'>h4</Typography>
        <Typography type='h5'>h5</Typography>
        <Typography type='h6'>h6</Typography>
      </Columns>

      <CodeBlock code={`
        import Columns from '@/components/ux/layout/Columns';
        import Typography from '@/components/ux/text/Typography';

        <Columns numberOfColumns={6} style = {{ alignItems: 'center' }}>
          <Typography type='h1'>h1</Typography>
          <Typography type='h2'>h2</Typography>
          <Typography type='h3'>h3</Typography>
          <Typography type='h4'>h4</Typography>
          <Typography type='h5'>h5</Typography>
          <Typography type='h6'>h6</Typography>
        </Columns>
      `} />
      <Divider />

      <Typography type='subtitle1'>subtitle1</Typography>
      <Typography type='subtitle1'>{Textor.generateLoremIpsum(1, 1)}</Typography>
      <CodeBlock code = {`
        import Typography from '@/components/ux/text/Typography';

        <Typography type='subtitle1'>subtitle1</Typography>
      `} />
      <Divider style = {{ marginBottom: 10 }} />

      <Typography type='subtitle2'>subtitle2</Typography>
      <Typography type='subtitle2'>{Textor.generateLoremIpsum(1, 1)}</Typography>
      <CodeBlock code = {`
        import Typography from '@/components/ux/text/Typography';

        <Typography type='subtitle2'>subtitle2</Typography>
      `} />
      <Divider style = {{ marginBottom: 10 }} />

      <Typography type='body1'>body1</Typography>
      <Typography type='body1'>{Textor.generateLoremIpsum(1, 1)}</Typography>
      <CodeBlock code = {`
        import Typography from '@/components/ux/text/Typography';

        <Typography type='body1'>body1</Typography>
      `} />
      <Divider style = {{ marginBottom: 10 }} />

      <Typography type='body2'>body2</Typography>
      <Typography type='body2'>{Textor.generateLoremIpsum(1, 1)}</Typography>
      <CodeBlock code = {`
        import Typography from '@/components/ux/text/Typography';

        <Typography type='body2'>body2</Typography>
      `} />
      <Divider style = {{ marginBottom: 10 }} />

      <Typography type='caption'>caption</Typography>
      <Typography type='caption'>{Textor.generateLoremIpsum(1, 1)}</Typography>
      <CodeBlock code = {`
        import Typography from '@/components/ux/text/Typography';

        <Typography type='caption'>caption</Typography>
      `} />
      <Divider style = {{ marginBottom: 10 }} />

      <Typography type='overline'>overline</Typography>
      <Typography type='overline'>{Textor.generateLoremIpsum(1, 1)}</Typography>
      <CodeBlock code = {`
        import Typography from '@/components/ux/text/Typography';

        <Typography type='overline'>overline</Typography>
      `} />
      <Divider style = {{ marginBottom: 10 }} />

      <Typography type='body1'>a</Typography>
      <Typography type='a'>{Textor.generateLoremIpsum(1, 1)}</Typography>
      <CodeBlock code = {`
        import Typography from '@/components/ux/text/Typography';

        <Typography type='body1'>a</Typography>
      `} />
      <Divider style = {{ marginBottom: 10 }} />

      <Typography type = 'inherit'>inherit</Typography>
      <Typography type='inherit'>{Textor.generateLoremIpsum(1, 1)}</Typography>
      <CodeBlock code = {`
        import Typography from '@/components/ux/text/Typography';

        <Typography type = 'inherit'>inherit</Typography>
      `} />
      <Divider style = {{ marginBottom: 10 }} />

    </div>
  );
}

