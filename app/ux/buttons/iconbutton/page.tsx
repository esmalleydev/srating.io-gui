'use client';

import IconButton from '@/components/ux/buttons/IconButton';
import Divider from '@/components/ux/display/Divider';
import Columns from '@/components/ux/layout/Columns';
import CodeBlock from '@/components/ux/text/CodeBlock';
import Typography from '@/components/ux/text/Typography';
import AssessmentIcon from '@esmalley/react-material-icons/Assessment';
import { toaster } from '@esmalley/ts-utils';

export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <Typography type='h5' style={{ marginBottom: 20 }}>IconButton</Typography>
      <Typography type='body1' style={{ marginBottom: 10 }}>
        IconButton is a compact, icon-only button designed for quick actions. It supports different shapes (standard, circle) and badges.
      </Typography>

      <Typography type='h6' style={{ marginBottom: 10 }}>Types</Typography>
      <Columns>
        <div style={{ textAlign: 'center' }}>
          <Typography type='caption'>Standard</Typography>
          <IconButton icon={<AssessmentIcon style={{ fontSize: 24 }} />} value={1} onClick={() => toaster.add('clicked standard', 'success')} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Typography type='caption'>Circle</Typography>
          <IconButton icon={<AssessmentIcon style={{ fontSize: 20 }} />} value={1} onClick={() => toaster.add('clicked circle', 'success')} type='circle' />
        </div>
      </Columns>
      <CodeBlock code={`
        import IconButton from '@/components/ux/buttons/IconButton';
        import AssessmentIcon from '@esmalley/react-material-icons/Assessment';
        import { toaster } from '@esmalley/ts-utils';

        <IconButton icon={<AssessmentIcon />} value={1} onClick={() => toaster.add('clicked', 'success')} />
        <IconButton icon={<AssessmentIcon />} value={1} type='circle' onClick={() => toaster.add('clicked', 'success')} />
      `} />
      <Divider style={{ margin: '10px 0px' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>Badge Counter</Typography>
      <Columns>
        <div style={{ textAlign: 'center' }}>
          <Typography type='caption'>Standard</Typography>
          <IconButton icon={<AssessmentIcon style={{ fontSize: 24 }} />} value={1} onClick={() => toaster.add('clicked standard', 'success')} badge={5} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Typography type='caption'>Circle</Typography>
          <IconButton icon={<AssessmentIcon style={{ fontSize: 20 }} />} value={1} onClick={() => toaster.add('clicked circle', 'success')} type='circle' badge={2} />
        </div>
      </Columns>
      <CodeBlock code={`
        import IconButton from '@/components/ux/buttons/IconButton';
        import { toaster } from '@esmalley/ts-utils';

        <IconButton icon={<AssessmentIcon />} value={1} badge={5} onClick={() => toaster.add('clicked', 'success')} />
        <IconButton icon={<AssessmentIcon />} value={1} type='circle' badge={2} onClick={() => toaster.add('clicked', 'success')} />
      `} />
      <Divider style={{ margin: '10px 0px' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>Disabled</Typography>
      <Columns>
        <div style={{ textAlign: 'center' }}>
          <Typography type='caption'>Standard</Typography>
          <IconButton icon={<AssessmentIcon style={{ fontSize: 24 }} />} value={1} onClick={() => toaster.add('clicked standard', 'success')} disabled />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Typography type='caption'>Circle</Typography>
          <IconButton icon={<AssessmentIcon style={{ fontSize: 20 }} />} value={1} onClick={() => toaster.add('clicked circle', 'success')} type='circle' disabled />
        </div>
      </Columns>
      <CodeBlock code={`
        import IconButton from '@/components/ux/buttons/IconButton';

        <IconButton icon={<AssessmentIcon />} value={1} disabled />
        <IconButton icon={<AssessmentIcon />} value={1} type='circle' disabled />
      `} />
      <Divider />
    </div>
  );
}
