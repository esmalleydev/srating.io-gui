'use client';

import Button from '@/components/ux/buttons/Button';
import Divider from '@/components/ux/display/Divider';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import SendIcon from '@esmalley/react-material-icons/Send';


export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Button</Typography>
      <Typography type='h6' style={{ marginBottom: 10 }}>Types</Typography>
      <Columns>
        <Button title = 'Standard' value = {1} handleClick={() => alert('clicked standard')} />
        <Button title = 'Select' value = {1} type='select' handleClick={() => alert('clicked select')} />
      </Columns>
      <Divider style = {{ margin: '10px 0px' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>Ink</Typography>
      <Columns>
        <Button title = 'Standard ink' value = {1} handleClick={() => alert('clicked standard ink')} ink />
        <Button title = 'Select ink' value = {1} type='select' handleClick={() => alert('clicked select ink')} ink />
      </Columns>
      <Divider style = {{ margin: '10px 0px' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>Disabled</Typography>
      <Columns numberOfColumns={4}>
        <Button title = 'Standard' value = {1} handleClick={() => alert('clicked standard')} disabled />
        <Button title = 'Select' value = {1} type='select' handleClick={() => alert('clicked select')} disabled />
        <Button title = 'Standard ink' value = {1} handleClick={() => alert('clicked standard ink')} ink disabled />
        <Button title = 'Select ink' value = {1} type='select' handleClick={() => alert('clicked select ink')} ink disabled />
      </Columns>
      <Divider style = {{ margin: '10px 0px' }} />

      <Typography type='h6' style={{ marginBottom: 10 }}>End icon</Typography>
      <Columns numberOfColumns={4}>
        <Button title = 'Standard' value = {1} handleClick={() => alert('clicked standard')} endIcon={<SendIcon style={{ fontSize: 20 }} />} />
        <Button title = 'Select' value = {1} type='select' handleClick={() => alert('clicked select')} endIcon={<SendIcon style={{ fontSize: 20 }} />} />
        <Button title = 'Standard ink' value = {1} handleClick={() => alert('clicked standard ink')} ink endIcon={<SendIcon style={{ fontSize: 20 }} />} />
        <Button title = 'Select ink' value = {1} type='select' handleClick={() => alert('clicked select ink')} ink endIcon={<SendIcon style={{ fontSize: 20 }} />} />
      </Columns>
      <Divider style = {{ margin: '10px 0px' }} />
    </div>
  );
}
