'use client';

import { useState } from 'react';
import Typography from '@/components/ux/text/Typography';
import Divider from '@/components/ux/display/Divider';
import Inputs from '@/components/ux/input/Inputs';
import MultiPicker, { MultiPickerOption, MultiPickerProps } from '@/components/ux/input/MultiPicker';

type ControlledMultiPickerProps = Omit<MultiPickerProps, 'inputHandler' | 'options' | 'selected'>;

// Helper component isolated to this page
const ControlledInput = (props: ControlledMultiPickerProps) => {
  const {
    selected: propsSelected,
    // inputHandler: _inputHandler,
    // options: _options,
    ...otherProps
  } = props;

  const [selected, setSelected] = useState(propsSelected || []);
  const inputHandler = new Inputs();

  const options: MultiPickerOption[] = [
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
  ];

  return (
    <MultiPicker
      inputHandler={inputHandler}
      options = {options}
      selected={selected}
      {...otherProps}
      onChange={(val) => setSelected(val)}
    />
  );
};

export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Date Inputs</Typography>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
        <ControlledInput />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Radio</Typography>
        <ControlledInput label='Radio option, can only select one.' isRadio />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Number of columns</Typography>
        <ControlledInput label='Specified 5 colunns' numberOfColumns={5} options = {[
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
        ]} />

      <Typography type='h6' style={{ marginBottom: 10 }}>Errors</Typography>
        <ControlledInput error={true} errorMessage='Error message!' />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Disabled</Typography>
        <ControlledInput label = 'These options are disabled' disabled={true} />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Required</Typography>
        <ControlledInput label = 'This question is required' required={true} />
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Hide Error msg</Typography>
        <ControlledInput label='Hidden error message' showError={false} />
      <Divider />


    </div>
  );
}
