'use client';


import { usePathname } from 'next/navigation';
import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/ux/contexts/themeContext';

import KeyboardArrowDownIcon from '@esmalley/react-material-icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@esmalley/react-material-icons/KeyboardArrowUp';

import { useState } from 'react';
import { Objector } from '@esmalley/ts-utils';

export default function UXLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const theme = useTheme();

  const [expanded, setExpanded] = useState(new Set(['inputs', 'containers', 'layouts', 'buttons']));

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
      value: 'buttons',
      name: 'Buttons',
      children: [
        { value: 'button', name: 'Button' },
        { value: 'iconbutton', name: 'IconButton' },
        { value: 'tab', name: 'Tab' },
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
      value: 'modal',
      name: 'Modal',
    },
    {
      value: 'loading',
      name: 'Loading states',
    },
  ];

  const getSidebarItemStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      padding: '10px 0px',
      cursor: 'pointer',
      borderRadius: '4px',
      color: isActive ? theme.info.main : theme.text.primary,
      fontWeight: isActive ? 'bold' : 'normal',
      transition: 'background-color 0.2s',
      display: 'block',
      textDecoration: 'none',
    //   border: isActive ? `1px solid ${theme.info.main}` : 'none',
    };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* Sidebar Navigation */}
      <div style={{
        width: '250px',
        borderRight: `2px solid ${theme.secondary.main}`,
        padding: '10px 20px',
        display: 'flex',
        flexDirection: 'column',
        // gap: '8px',
        backgroundColor: theme.background.main,
      }}>
        <Typography type='h6' style={{ marginBottom: '16px', color: theme.text.secondary }}>Component list</Typography>

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
              style = {{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
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
            <div style = {{ paddingLeft: 10 }}>
              {row_children.map((child) => {
                return (
                  expanded.has(section) ?
                  <Typography type='a' href={`/ux/${section}/${child.value}`} style={getSidebarItemStyle(`/ux/${section}/${child.value}`)}>{child.name}</Typography>
                    : ''
                );
              })}
            </div>
            </>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}
