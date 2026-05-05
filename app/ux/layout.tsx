'use client';


import { usePathname } from 'next/navigation';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/ux/contexts/themeContext';

import KeyboardArrowDownIcon from '@esmalley/react-material-icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@esmalley/react-material-icons/KeyboardArrowUp';

import { useState } from 'react';
import { Objector } from '@esmalley/ts-utils';
import Drawer from '@/components/ux/overlay/Drawer';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import IconButton from '@/components/ux/buttons/IconButton';
import WebIcon from '@esmalley/react-material-icons/Web';

const getSideBarContents = () => {
  const pathname = usePathname();
  const theme = useTheme();

  const [expanded, setExpanded] = useState(new Set(['inputs', 'containers', 'layouts', 'text', 'buttons']));

  const sections = [
    {
      value: 'icons',
      name: 'Icons',
    },
    {
      value: 'layouts',
      name: 'Layouts',
      children: [
        { value: 'columns', name: 'Columns' },
        { value: 'wizard', name: 'Wizard' },
      ],
    },
    {
      value: 'containers',
      name: 'Containers',
      children: [
        { value: 'paper', name: 'Paper' },
        { value: 'chip', name: 'Chip' },
        { value: 'slab', name: 'Slab' },
        { value: 'tile', name: 'Tile' },
      ],
    },
    {
      value: 'text',
      name: 'Text',
      children: [
        { value: 'typography', name: 'Typography' },
        { value: 'codeblock', name: 'CodeBlock' },
      ],
    },
    {
      value: 'inputs',
      name: 'Inputs',
      children: [
        { value: 'text', name: 'Text' },
        { value: 'date', name: 'Date' },
        { value: 'select', name: 'Select' },
        { value: 'multiple', name: 'Multiple' },
        { value: 'toggle', name: 'Toggle' },
        { value: 'textarea', name: 'Textarea' },
      ],
    },
    {
      value: 'buttons',
      name: 'Buttons',
      children: [
        { value: 'button', name: 'Button' },
        { value: 'iconbutton', name: 'IconButton' },
        { value: 'tab', name: 'Tab' },
      ],
    },
    {
      value: 'modal',
      name: 'Modal',
    },
    {
      value: 'menu',
      name: 'Menu',
    },
    {
      value: 'loading',
      name: 'Loading states',
    },
  ];

  const getSidebarItemStyle = (path: string) => {
    const isActive = pathname === path;

    const style: Record<string, unknown> = {
      padding: '10px 0px',
      cursor: 'pointer',
      // borderRadius: '4px',
      color: isActive ? theme.info.main : theme.text.primary,
      transition: 'background-color 0.2s',
      display: 'block',
      textDecoration: 'none',
      paddingLeft: 20,
      '&:hover': {
        backgroundColor: theme.action.hover,
      },
    };

    if (isActive) {
      style.borderLeft = `1px solid ${style.color}`;
      style.backgroundColor = theme.action.hover;
    }
    return style;
  };


  return (
    <div style={{
      width: '250px',
      borderRight: `2px solid ${theme.secondary.main}`,
      display: 'flex',
      flexDirection: 'column',
      // gap: '8px',
      backgroundColor: theme.background.main,
    }}>
      <Typography type='h6' style={{ marginBottom: '16px', paddingLeft: 20, color: theme.text.secondary }}>Component list</Typography>

      <Typography type='a' href="/ux" style={getSidebarItemStyle('/ux')}>
        Getting started
      </Typography>

      {sections.map((row) => {
        const section = row.value;
        const row_children = row.children;

        if (!row_children || !row_children.length) {
          return (
            <Typography type='a' href={`/ux/${section}`} style={getSidebarItemStyle(`/ux/${section}`)}>{row.name}</Typography>
          );
        }
        return (
          <>
          <div
            style = {{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', paddingLeft: 20 }}
            onClick={() => {
              if (expanded.has(section)) {
                expanded.delete(section);
              } else {
                expanded.add(section);
              }
              setExpanded(Objector.deepClone(expanded));
            }}
          >
            <Typography type = 'body1'>{row.name}</Typography>
            {expanded.has(section) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </div>
          <div>
            {row_children.map((child) => {
              return (
                expanded.has(section) ?
                <Typography type='a' href={`/ux/${section}/${child.value}`} style={getSidebarItemStyle(`/ux/${section}/${child.value}`)}><span style = {{ paddingLeft: 10 }}></span>{child.name}</Typography>
                  : ''
              );
            })}
          </div>
          </>
        );
      })}
    </div>
  );
};

export default function UXLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const { width } = useWindowDimensions() as Dimensions;
  const [drawerOpen, setDrawerOpen] = useState(false);

  // todo make this sidebar independent from the rest

  return (
    <div style = {{ display: 'flex' }}>
      <div style = {{ height: '100%', overflowY: 'scroll' }}>
         {
        width <= 750 ?
        <>
        <div style = {{ width: 50, textAlign: 'center', paddingTop: 10, borderRight: `2px solid ${theme.secondary.main}` }}>
          <IconButton onClick = {() => setDrawerOpen(!drawerOpen)} value = 'sidebar' icon = {<WebIcon style = {{ fontSize: 24, color: theme.text.secondary }} />} />
        </div>
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {getSideBarContents()}
        </Drawer>
        </>
          : getSideBarContents()
      }
      </div>

      <div style={{ flex: 1, padding: '10px 20px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
