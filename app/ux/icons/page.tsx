'use client';

import { lazy, LazyExoticComponent, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Typography from '@/components/ux/text/Typography';
import TextInput from '@/components/ux/input/TextInput';
import Columns from '@/components/ux/layout/Columns';
import Inputs from '@/components/ux/input/Inputs';
import MultiPicker, { MultiPickerOption } from '@/components/ux/input/MultiPicker';
import Tile from '@/components/ux/container/Tile';
import Modal from '@/components/ux/modal/Modal';
import { useTheme } from '@/components/ux/contexts/themeContext';
import manifest from '@esmalley/react-material-icons/utils/manifest';
import { Textor } from '@esmalley/ts-utils';
import CodeBlock from '@/components/ux/text/CodeBlock';
import Button from '@/components/ux/buttons/Button';

// todo export icon type to set in any

const DynamicIcon = ({ name, color }) => {
  const IconComponent: LazyExoticComponent<any> = useMemo(
    () => lazy(() => {
      return import(`@esmalley/react-material-icons/${name}`).then((module) => {
        const Component = module[name] ?? module.default ?? Object.values(module)[0];
        if (!Component || (typeof Component !== 'function' && typeof Component !== 'object')) {
          return { default: () => <div>?</div> };
        }
        return { default: Component };
      }).catch(() => {
        return { default: () => <div>?</div> };
      });
    }),
    [name],
  );

  return (
    <Suspense fallback={<div className="icon-placeholder" />}>
      <IconComponent size={24} color={color} />
    </Suspense>
  );
};

const CHUNK_SIZE = 50;

export default function IconGalleryPage() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('filled');
  const [selected, setSelected] = useState('');
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

  useEffect(() => {
    setVisibleCount(CHUNK_SIZE);
  }, [query, category]);

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

  const categories: MultiPickerOption[] = Object.keys(manifest).map((cat) => ({
    value: cat,
    label: Textor.toSentenceCase(cat),
  }));

  const importString = `import ${selected}Icon from '@esmalley/react-material-icons/${selected}';`;

  return (
    <div>
      <Typography type='h5' style={{ marginBottom: 20 }}>Icons</Typography>
      <div style={{ paddingBottom: 5 }}>
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
        />
      </div>
      <TextInput
        inputHandler={inputHandler}
        placeholder='Search icons...'
        variant='outlined'
        value={query}
        onChange={(val) => setQuery(val)}
      />
      <div ref={scrollContainerRef} style={{ maxHeight: 400, overflowY: 'scroll', marginTop: 20 }}>
        <Columns numberOfColumns={5}>
          {visible.map((name) => (
            <Tile
              key={name}
              icon={<DynamicIcon name={name} color={theme.text?.primary || '#000'} />}
              primary={name}
              style = {{ padding: '10px 0px' }}
              onClick={() => setSelected(name)}
            />
          ))}
        </Columns>

        {visibleCount < allFiltered.length && (
          <div ref={loaderRef} style={{ padding: 20, textAlign: 'center' }}>
            <Typography type='caption'>
              {`${visibleCount} / ${allFiltered.length}`}
            </Typography>
          </div>
        )}
      </div>
      <Modal open={selected !== ''} onClose={() => setSelected('')} paperStyle={{ maxWidth: 800 }}>
        <Typography type = 'h6'>Copy import string</Typography>
        <CodeBlock code = {importString} style = {{ padding: '0px' }}/>
        <div style = {{ textAlign: 'right' }}>
          <Button title = 'Copy' value = 'copy' handleClick={() => alert('todo copy to clipboard')} />
        </div>
      </Modal>
    </div>
  );
}
