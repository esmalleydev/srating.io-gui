'use client';

import IconButton from '@/components/ux/buttons/IconButton';
import Divider from '@/components/ux/display/Divider';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import AssessmentIcon from '@esmalley/react-material-icons/Assessment';



export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>IconButton</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>Types</Typography>
      <Columns>
        <div>
          <Typography type = 'caption'>Standard</Typography>
          <IconButton icon = {<AssessmentIcon style = {{ fontSize: 24 }} />} value = {1} onClick={() => alert('clicked standard')} />
        </div>
        <div>
          <Typography type = 'caption'>Circle</Typography>
          <IconButton icon = {<AssessmentIcon style = {{ fontSize: 20 }} />} value = {1} onClick={() => alert('clicked circle')} type = 'circle' />
        </div>
      </Columns>
      <Divider style = {{ margin: '10px 0px' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>Badge counter</Typography>
      <Columns>
        <div>
          <Typography type = 'caption'>Standard</Typography>
          <IconButton icon = {<AssessmentIcon style = {{ fontSize: 24 }} />} value = {1} onClick={() => alert('clicked standard')} badge={5} />
        </div>
        <div>
          <Typography type = 'caption'>Circle</Typography>
          <IconButton icon = {<AssessmentIcon style = {{ fontSize: 20 }} />} value = {1} onClick={() => alert('clicked circle')} type = 'circle' badge={2} />
        </div>
      </Columns>
      <Divider style = {{ margin: '10px 0px' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>Disabled</Typography>
      <Columns>
        <div>
          <Typography type = 'caption'>Standard</Typography>
          <IconButton icon = {<AssessmentIcon style = {{ fontSize: 24 }} />} value = {1} onClick={() => alert('clicked standard')} disabled />
        </div>
        <div>
          <Typography type = 'caption'>Circle</Typography>
          <IconButton icon = {<AssessmentIcon style = {{ fontSize: 20 }} />} value = {1} onClick={() => alert('clicked circle')} type = 'circle' disabled />
        </div>
      </Columns>
      <Divider style = {{ margin: '10px 0px' }} />
    </div>
  );
}
