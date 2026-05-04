'use client';

import { useState } from 'react';
import SearchIcon from '@esmalley/react-material-icons/Search';
import Typography from '@/components/ux/text/Typography';
import Divider from '@/components/ux/display/Divider';
import Columns from '@/components/ux/layout/Columns';
import Inputs from '@/components/ux/input/Inputs';
import DateInput from '@/components/ux/input/DateInput';
import { DateInputProps } from '@/components/ux/input/hooks/useInputLogic';

// Helper component isolated to this page
const ControlledInput = (props: DateInputProps) => {
  const { value: propsValue, ...otherProps } = props;
  const [value, setValue] = useState<string | Date | null>(propsValue || '');
  const inputHandler = new Inputs();

  return (
    <DateInput
      inputHandler={inputHandler}
      value={value}
      onChange={(val) => setValue(val)}
      {...otherProps}
    />
  );
};

export default function Page() {
  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Date Inputs</Typography>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput placeholder='Outlined' variant='outlined' />
        <ControlledInput placeholder='Filled' variant='filled' />
        <ControlledInput placeholder='Standard' variant='standard' />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Date and time</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput placeholder='Outlined' variant='outlined' enableTime />
        <ControlledInput placeholder='Filled' variant='filled' enableTime />
        <ControlledInput placeholder='Standard' variant='standard' enableTime />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Standard w/ label</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput label='Outlined label' placeholder='Outlined' variant='outlined' />
        <ControlledInput label='Filled label' placeholder='Filled' variant='filled' />
        <ControlledInput label='Standard label' placeholder='Standard' variant='standard' />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Errors</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput placeholder='Outlined' variant='outlined' error={true} errorMessage='Outlined error message!' />
        <ControlledInput placeholder='Filled' variant='filled' error={true} errorMessage='Filled error message!' />
        <ControlledInput placeholder='Standard' variant='standard' error={true} errorMessage='Standard error message!' />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Disabled</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput value='I am disabled' placeholder='Outlined' variant='outlined' disabled={true} />
        <ControlledInput value='I am disabled' placeholder='Filled' variant='filled' disabled={true} />
        <ControlledInput value='I am disabled' placeholder='Standard' variant='standard' disabled={true} />
      </Columns>
      <Divider />

      {/* <Typography type='h6' style={{ marginBottom: 10 }}>Formatter</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput value='Text' placeholder='Text' variant='outlined' formatter='text' />
        <ControlledInput value={123} placeholder='Numbers only' variant='filled' formatter='number' />
        <ControlledInput value={55.55} placeholder='Money' variant='standard' formatter='money' />
      </Columns>
      <Divider /> */}

      <Typography type='h6' style={{ marginBottom: 10 }}>Required</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput placeholder='Required' variant='outlined' required={true} />
        <ControlledInput placeholder='Required' variant='filled' required={true} />
        <ControlledInput placeholder='Required' variant='standard' required={true} />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Min / Max</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput placeholder='Min date' variant='outlined' value={'2011-04-20'} minDate={'2011-05-01'} />
        <ControlledInput placeholder='Max date' variant='filled' value={'2026-04-05'} maxDate={'2026-04-01'} />
        <ControlledInput placeholder='Min + max date' variant='standard' value='2023-02-10' minDate='2023-02-01' maxDate='2023-02-15' />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Icons</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput icon={<SearchIcon style = {{ fontSize: 20 }} />} placeholder='Icon' variant='outlined' />
        <ControlledInput icon={<SearchIcon style = {{ fontSize: 20 }} />} placeholder='Icon' variant='filled' />
        <ControlledInput icon={<SearchIcon style = {{ fontSize: 20 }} />} placeholder='Icon' variant='standard' />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Clear input</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput placeholder='Clear' variant='outlined' value='clear input value' clear={true} />
        <ControlledInput placeholder='Clear' variant='filled' value='clear input value' clear={true} />
        <ControlledInput placeholder='Clear' variant='standard' value='clear input value' clear={true} />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Hide Error msg</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput placeholder='Hidden error message' variant='outlined' value='text' showError={false} />
        <ControlledInput placeholder='Hidden error message' variant='filled' value='text' showError={false} />
        <ControlledInput placeholder='Hidden error message' variant='standard' value='text' showError={false} />
      </Columns>
      <Divider />

      <Typography type='h6' style={{ marginBottom: 10 }}>Hide placeholder transform</Typography>
      <Columns numberOfColumns={3}>
        <ControlledInput placeholder='Hide placeholder' variant='outlined' transformPlaceholder={false} />
        <ControlledInput placeholder='Hide placeholder' variant='filled' transformPlaceholder={false} />
        <ControlledInput placeholder='Hide placeholder' variant='standard' transformPlaceholder={false} />
      </Columns>
      <Divider />
    </div>
  );
}
