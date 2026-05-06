'use client';

import Typography from '@/components/ux/text/Typography';
import Tooltip from '@/components/ux/overlay/Tooltip';
import IconButton from '@/components/ux/buttons/IconButton';
import InfoIcon from '@esmalley/react-material-icons/Info';
import CodeBlock from '@/components/ux/text/CodeBlock';

export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Tooltip</Typography>

       <Typography type='body1'>Add hover title text to any element.</Typography>

       <Typography type='h6' style={{ marginTop: 40, marginBottom: 10 }}>Positions</Typography>
       <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
         <Tooltip text='Top'>
           <IconButton icon={<InfoIcon style = {{ fontSize: 30 }} />} value={1} onClick={() => {}} />
         </Tooltip>
         <Tooltip text='Left' position='left'>
           <IconButton icon={<InfoIcon style = {{ fontSize: 30 }} />} value={2} onClick={() => {}} />
         </Tooltip>
         <Tooltip text='Right' position='right'>
           <IconButton icon={<InfoIcon style = {{ fontSize: 30 }} />} value={3} onClick={() => {}} />
         </Tooltip>
         <Tooltip text='Bottom' position='bottom'>
           <IconButton icon={<InfoIcon style = {{ fontSize: 30 }} />} value={4} onClick={() => {}} />
         </Tooltip>
       </div>

       <Typography type='h6' style={{ marginTop: 40, marginBottom: 10 }}>Delay</Typography>
       <Tooltip text='Delayed tooltip' delay={1000}>
         <IconButton icon={<InfoIcon style = {{ fontSize: 30 }} />} value={5} onClick={() => {}} />
       </Tooltip>
       <Typography type='body2' style={{ marginLeft: 40 }}>Wait 1 second before appearing.</Typography>

       <Typography type='h6' style={{ marginTop: 40, marginBottom: 10 }}>Click Behavior</Typography>
       <div style={{ display: 'flex', gap: 20 }}>
         <Tooltip text='Click to show and fade' onClickFade={1000}>
           <IconButton icon={<InfoIcon style = {{ fontSize: 30 }} />} value={6} onClick={() => {}} />
         </Tooltip>
         <Tooltip text='Click to remove' onClickRemove={true}>
           <IconButton icon={<InfoIcon style = {{ fontSize: 30 }} />} value={7} onClick={() => {}} />
         </Tooltip>
       </div>

       <Typography type='h6' style={{ marginTop: 40, marginBottom: 10 }}>Custom Styles</Typography>
       <Tooltip
         text='Custom styled tooltip'
         style={{ backgroundColor: 'red', color: 'white', borderRadius: '10px' }}
       >
         <IconButton icon={<InfoIcon style = {{ fontSize: 30 }} />} value={8} onClick={() => {}} />
       </Tooltip>

       <Typography type='h6' style={{ marginTop: 40, marginBottom: 10 }}>Code Example</Typography>
       <CodeBlock code={`
          import Tooltip from '@/components/ux/overlay/Tooltip';

          <Tooltip 
            text='Custom tooltip' 
            position='top' 
            delay={500}
            onClickFade={2000}
          >
            <button>Hover me</button>
          </Tooltip>
        `} />
    </div>
  );
}
