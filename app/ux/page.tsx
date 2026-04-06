
'use client';

import SearchIcon from '@mui/icons-material/Search';

import Divider from '@/components/ux/display/Divider';
import TextInput from '@/components/ux/input/TextInput';
import Columns from '@/components/ux/layout/Columns';
import Typography from '@/components/ux/text/Typography';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import CircularProgress from '@/components/ux/loading/CircularProgress';
import LinearProgress from '@/components/ux/loading/LinearProgress';
import Button from '@/components/ux/buttons/Button';
import Backdrop from '@/components/ux/loading/Backdrop';
import Skeleton from '@/components/ux/loading/Skeleton';
import Inputs from '@/components/ux/input/Inputs';

import manifest from '@esmalley/react-material-icons/utils/manifest';
import { Textor } from '@esmalley/ts-utils';
import MultiPicker, { MultiPickerOption } from '@/components/ux/input/MultiPicker';
import Tile from '@/components/ux/container/Tile';
import { useTheme } from '@/components/ux/contexts/themeContext';
import Modal from '@/components/ux/modal/Modal';


// Helper component to handle the dynamic named import
const DynamicIcon = ({ name, color }) => {
  const IconComponent: any = useMemo(
    () => lazy(() => {
      console.log(`importing ${name}`);
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
      });
    }),
    [name],
  );

  return (
    <Suspense fallback={<div className="icon-placeholder" />}>
      <IconComponent size={24} color = {color} />
    </Suspense>
  );
};

const CHUNK_SIZE = 50;

const IconGallery = () => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('filled');
  const [selected, setSelected] = useState('');
  // const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const inputHandler = new Inputs();

  const allFiltered = useMemo(() => {
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safeQuery, 'i');

    return manifest[category].filter((name) => regex.test(name));
  }, [query, category]);


  const visible = useMemo(
    () => allFiltered.slice(0, visibleCount),
    [allFiltered, visibleCount],
  );

  // Reset when query or category changes
  useEffect(() => {
    setVisibleCount(CHUNK_SIZE);
  }, [query, category]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + CHUNK_SIZE, allFiltered.length));
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [allFiltered.length]);


  const categories: MultiPickerOption[] = [];

  for (const cat in manifest) {
    categories.push({
      value: cat,
      label: Textor.toSentenceCase(cat),
    });
  }

  return (
    <div>
      <div style = {{ paddingBottom: 5 }}>
        <MultiPicker
          inputHandler={inputHandler}
          label='Icon type'
          onChange={(val) => setCategory(val as string)}
          required
          options={categories}
          selected={[category]}
          isRadio
          numberOfColumns={5}
          showError={false}
          // triggerValidation={triggerValidation}
        />
      </div>
      <TextInput
        inputHandler={inputHandler}
        placeholder = 'Search icons...'
        variant = 'outlined'
        value = {query}
        onChange = {(val) => setQuery(val)}
      />
      <div ref={scrollContainerRef} style={{ maxHeight: 300, overflowY: 'scroll' }}>
        <Columns numberOfColumns={5}>
          {visible.map((name) => (
            <Tile
              key={name}
              icon={<DynamicIcon name={name} color={theme.text.primary} />}
              primary={name}
              onClick={() => setSelected(name)}
            />
          ))}
        </Columns>

        {/* Sentinel must be inside the scrollable root */}
        {visibleCount < allFiltered.length && (
          <div ref={loaderRef} style={{ padding: 20, textAlign: 'center' }}>
            <Typography type='caption'>
              {`${visibleCount} / ${allFiltered.length}`}
            </Typography>
          </div>
        )}
      </div>
      <Modal open = {selected !== ''} onClose={() => setSelected('')}>
        <Typography type = 'caption'>{`import ${selected} from @esmalley/react-material-icons/${selected}`}</Typography>
      </Modal>
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
