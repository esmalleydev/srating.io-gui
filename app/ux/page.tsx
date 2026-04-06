
'use client';

import SearchIcon from '@mui/icons-material/Search';

import Divider from '@/components/ux/display/Divider';
import TextInput from '@/components/ux/input/TextInput';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import CircularProgress from '@/components/ux/loading/CircularProgress';
import LinearProgress from '@/components/ux/loading/LinearProgress';
import Button from '@/components/ux/buttons/Button';
import Backdrop from '@/components/ux/loading/Backdrop';
import Skeleton from '@/components/ux/loading/Skeleton';
import Inputs from '@/components/ux/input/Inputs';

import manifest from '@esmalley/react-material-icons/utils/manifest';


// Helper component to handle the dynamic named import
const DynamicIcon = ({ name }) => {
  const IconComponent = useMemo(
    () =>
      lazy(() => {
        console.log('importing ' + name);
        return import(`@esmalley/react-material-icons/${name}`).then((module) => {
          // Try named export first (e.g. module.HomeIcon)
          const Component = module[name] ?? module.default ?? Object.values(module)[0];

          if (!Component || (typeof Component !== 'function' && typeof Component !== 'object')) {
            console.error(`No valid component found in module for: ${name}`, module);
            return { default: () => <div>?</div> };
          }

          return { default: Component };
        }).catch((err) => {
          console.error(`Failed to load icon: ${name}`, err);
          return { default: () => <div>?</div> };
        })
      }),
    [name]
  );

  

  return (
    <Suspense fallback={<div className="icon-placeholder" />}>
      <IconComponent size={24} />
    </Suspense>
  );
};

const IconGallery = () => {
  const [query, setQuery] = useState('');

  // todo add sections
  const filtered = useMemo(() => {
    return manifest.filled
      .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 100);
  }, [query]);

  return (
    <div>
      <input 
        type="text"
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search icons..." 
      />
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
        {filtered.map((name) => (
          <div key={name} className="icon-card">
            <DynamicIcon name={name} />
            <span style={{ fontSize: '10px' }}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


const getInput = (props) => {
  const {
    value: propsValue,
    ...otherProps
  } = props;

  const [value, setValue] = useState(propsValue || '');
  const inputHandler = new Inputs();

  return (
    <TextInput
      inputHandler={inputHandler}
      value = {value}
      onChange={(val) => setValue(val)}
      {...otherProps}
    />
  );
};


const UX = () => {
  const [progress, setProgress] = useState(0);
  const [backdropOpen, setBackdropOpen] = useState(false);

  // Simulate progress for the determinate bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return 0;
        return Math.min(oldProgress + 10, 100);
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style = {{ padding: 20 }}>
      <IconGallery />
      <Typography type = 'h5'>Loading</Typography>
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Circle indeterminate</Typography>
      <CircularProgress />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Circle determinate</Typography>
      <CircularProgress type = 'determinate' value = {progress} />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Linear indeterminate</Typography>
      <LinearProgress />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Linear determinate</Typography>
      <LinearProgress type = 'determinate' value = {progress} />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Backdrop</Typography>
      <Backdrop open = {backdropOpen}><CircularProgress /></Backdrop>
      <Button value = 'back-drop' title = 'Backdrop' handleClick={() => setBackdropOpen(!!backdropOpen)} />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Skeleton</Typography>
      <Skeleton type='text' animation='wave' style = {{ width: 100, height: 25 }} />
      <Skeleton type='text' animation='pulse' style = {{ width: 100, height: 25 }} />
      <Skeleton type='circular' animation='wave' style = {{ width: 50, height: 50 }} />
      <Skeleton type='circular' animation='pulse' style = {{ width: 50, height: 50 }} />



      <Typography type = 'h5'>Text Inputs</Typography>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Standard</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          placeholder: 'Outlined',
          variant: 'outlined',
        })}
        {getInput({
          placeholder: 'Filled',
          variant: 'filled',
        })}
        {getInput({
          placeholder: 'Standard',
          variant: 'standard',
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Standard w/ label</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          label: 'Outlined label',
          placeholder: 'Outlined',
          variant: 'outlined',
        })}
        {getInput({
          label: 'Filled label',
          placeholder: 'Filled',
          variant: 'filled',
        })}
        {getInput({
          label: 'Standard label',
          placeholder: 'Standard',
          variant: 'standard',
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Errors</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          placeholder: 'Outlined',
          variant: 'outlined',
          error: true,
          errorMessage: 'Outlined error message!',
        })}
        {getInput({
          placeholder: 'Filled',
          variant: 'filled',
          error: true,
          errorMessage: 'Filled error message!',
        })}
        {getInput({
          placeholder: 'Standard',
          variant: 'standard',
          error: true,
          errorMessage: 'Standard error message!',
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Disabled</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          value: 'I am disabled',
          placeholder: 'Outlined',
          variant: 'outlined',
          disabled: true,
        })}
        {getInput({
          value: 'I am disabled',
          placeholder: 'Filled',
          variant: 'filled',
          disabled: true,
        })}
        {getInput({
          value: 'I am disabled',
          placeholder: 'Standard',
          variant: 'standard',
          disabled: true,
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Formatter</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          value: 'Text',
          placeholder: 'Text',
          variant: 'outlined',
          formatter: 'text',
        })}
        {getInput({
          value: 123,
          placeholder: 'Numbers only',
          variant: 'filled',
          formatter: 'number',
        })}
        {getInput({
          value: 55.55,
          placeholder: 'Money',
          variant: 'standard',
          formatter: 'money',
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Required</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          placeholder: 'Required',
          variant: 'outlined',
          required: true,
        })}
        {getInput({
          placeholder: 'Required',
          variant: 'filled',
          required: true,
        })}
        {getInput({
          placeholder: 'Required',
          variant: 'standard',
          required: true,
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Min / Max</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          placeholder: '5 minimum',
          variant: 'outlined',
          formatter: 'number',
          value: 1,
          min: 5,
        })}
        {getInput({
          placeholder: '5 max',
          variant: 'filled',
          formatter: 'number',
          value: 6,
          max: 5,
        })}
        {getInput({
          placeholder: 'Max length',
          variant: 'standard',
          formatter: 'text',
          value: 'a long string',
          maxLength: 10,
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Icons</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          icon: <SearchIcon />,
          placeholder: 'Icon',
          variant: 'outlined',
        })}
        {getInput({
          icon: <SearchIcon />,
          placeholder: 'Icon',
          variant: 'filled',
        })}
        {getInput({
          icon: <SearchIcon />,
          placeholder: 'Icon',
          variant: 'standard',
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Clear input</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          placeholder: 'Clear',
          variant: 'outlined',
          value: 'clear input value',
          clear: true,
        })}
        {getInput({
          placeholder: 'Clear',
          variant: 'filled',
          value: 'clear input value',
          clear: true,
        })}
        {getInput({
          placeholder: 'Clear',
          variant: 'standard',
          value: 'clear input value',
          clear: true,
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Hide Error msg</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          placeholder: 'Hidden error message',
          variant: 'outlined',
          value: 'text',
          formatter: 'number',
          showError: false,
        })}
        {getInput({
          placeholder: 'Hidden error message',
          variant: 'filled',
          value: 'text',
          formatter: 'number',
          showError: false,
        })}
        {getInput({
          placeholder: 'Hidden error message',
          variant: 'standard',
          value: 'text',
          formatter: 'number',
          showError: false,
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Hide placeholder transform</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          placeholder: 'Hide placeholder',
          variant: 'outlined',
          // value: 'Hello world',
          transformPlaceholder: false,
        })}
        {getInput({
          placeholder: 'Hide placeholder',
          variant: 'filled',
          // value: 'Hello world',
          transformPlaceholder: false,
        })}
        {getInput({
          placeholder: 'Hide placeholder',
          variant: 'standard',
          // value: 'Hello world',
          transformPlaceholder: false,
        })}
      </Columns>
      <Divider />
      <Typography type = 'h6' style = {{ marginBottom: 10 }}>Hide placeholder transform w/ icons</Typography>
      <Columns numberOfColumns={3}>
        {getInput({
          icon: <SearchIcon />,
          placeholder: 'Icon',
          variant: 'outlined',
          transformPlaceholder: false,
        })}
        {getInput({
          icon: <SearchIcon />,
          placeholder: 'Icon',
          variant: 'filled',
          transformPlaceholder: false,
        })}
        {getInput({
          icon: <SearchIcon />,
          placeholder: 'Icon',
          variant: 'standard',
          transformPlaceholder: false,
        })}
      </Columns>
      <Divider />
    </div>
  );
};

export default UX;
