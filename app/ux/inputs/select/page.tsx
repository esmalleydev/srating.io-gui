'use client';

import Divider from '@/components/ux/display/Divider';
import { SelectInputProps } from '@/components/ux/input/hooks/useInputLogic';
import Inputs from '@/components/ux/input/Inputs';
import Select from '@/components/ux/input/Select';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import SearchIcon from '@esmalley/react-material-icons/Search';
import { useState } from 'react';

type ControlledSelectProps = Omit<SelectInputProps, 'options'>;

const ControlledSelect = (props: ControlledSelectProps) => {
  const { value: propsValue, ...otherProps } = props;
  const [value, setValue] = useState(propsValue || '');
  const inputHandler = new Inputs();

  const options = [
    {
      label: 'Option 1',
      value: 1,
    },
    {
      label: 'Option 2',
      value: 2,
    },
    {
      label: 'Option 3',
      value: 3,
    },
    {
      label: 'Option 4',
      value: 4,
    },
    {
      label: 'Option 5',
      value: 5,
    },
  ];

  return (
    <Select
      inputHandler={inputHandler}
      value={value}
      onChange={(val) => setValue(val)}
      options = {options}
      {...otherProps}
    />
  );
};

export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Select inputs</Typography>

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <Columns numberOfColumns={3}>
        <ControlledSelect placeholder='Outlined' variant='outlined' />
        <ControlledSelect placeholder='Filled' variant='filled' />
        <ControlledSelect placeholder='Standard' variant='standard' />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard w/ label</Typography>
      <Columns numberOfColumns={3}>
        <ControlledSelect label='Outlined label' placeholder='Outlined' variant='outlined' />
        <ControlledSelect label='Filled label' placeholder='Filled' variant='filled' />
        <ControlledSelect label='Standard label' placeholder='Standard' variant='standard' />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Errors</Typography>
      <Columns numberOfColumns={3}>
        <ControlledSelect placeholder='Outlined' variant='outlined' error={true} errorMessage='Outlined error message!' />
        <ControlledSelect placeholder='Filled' variant='filled' error={true} errorMessage='Filled error message!' />
        <ControlledSelect placeholder='Standard' variant='standard' error={true} errorMessage='Standard error message!' />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Disabled</Typography>
      <Columns numberOfColumns={3}>
        <ControlledSelect placeholder='Outlined' variant='outlined' disabled={true} />
        <ControlledSelect placeholder='Filled' variant='filled' disabled={true} />
        <ControlledSelect placeholder='Standard' variant='standard' disabled={true} />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Required</Typography>
      <Columns numberOfColumns={3}>
        <ControlledSelect placeholder='Outlined' variant='outlined' required={true} />
        <ControlledSelect placeholder='Filled' variant='filled' required={true} />
        <ControlledSelect placeholder='Standard' variant='standard' required={true} />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Icons</Typography>
      <Columns numberOfColumns={3}>
        <ControlledSelect icon={<SearchIcon style = {{ fontSize: 20 }} />} placeholder='Icon' variant='outlined' />
        <ControlledSelect icon={<SearchIcon style = {{ fontSize: 20 }} />} placeholder='Icon' variant='filled' />
        <ControlledSelect icon={<SearchIcon style = {{ fontSize: 20 }} />} placeholder='Icon' variant='standard' />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Clear input</Typography>
      <Columns numberOfColumns={3}>
        <ControlledSelect placeholder='Clear' variant='outlined' clear={true} value = {1} />
        <ControlledSelect placeholder='Clear' variant='filled' clear={true} value = {2} />
        <ControlledSelect placeholder='Clear' variant='standard' clear={true} value = {3} />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Hide Error msg</Typography>
      <Columns numberOfColumns={3}>
        <ControlledSelect placeholder='Hidden error message' variant='outlined' showError={false} />
        <ControlledSelect placeholder='Hidden error message' variant='filled' showError={false} />
        <ControlledSelect placeholder='Hidden error message' variant='standard' showError={false} />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Hide placeholder transform</Typography>
      <Columns numberOfColumns={3}>
        <ControlledSelect placeholder='Hide placeholder' variant='outlined' transformPlaceholder={false} />
        <ControlledSelect placeholder='Hide placeholder' variant='filled' transformPlaceholder={false} />
        <ControlledSelect placeholder='Hide placeholder' variant='standard' transformPlaceholder={false} />
      </Columns>
      <Divider />
    </div>
  );
}
