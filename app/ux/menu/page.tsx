'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/ux/contexts/themeContext';
import Typography from '@/components/ux/text/Typography';
import Divider from '@/components/ux/display/Divider';
import Menu, { MenuOption } from '@/components/ux/menu/Menu';
import Tile from '@/components/ux/container/Tile';
import ListIcon from '@esmalley/react-material-icons/List';
import InfoIcon from '@esmalley/react-material-icons/Info';
import CheckCircleIcon from '@esmalley/react-material-icons/CheckCircle';
import Button from '@/components/ux/buttons/Button';
import { toaster } from '@esmalley/ts-utils';
import CodeBlock from '@/components/ux/text/CodeBlock';

const getOptions = () => {
  return [
    {
      value: 'option1',
      label: 'Option 1',
      secondaryLabel: 'Description for option 1',
      icon: <ListIcon />,
      selectable: true,
      onSelect: (opt: MenuOption) => toaster.add(`Selected: ${opt.label}`, 'success'),
    },
    {
      value: 'option2',
      label: 'Option 2',
      secondaryLabel: 'Description for option 2',
      icon: <InfoIcon />,
      selectable: true,
      onSelect: (opt: MenuOption) => toaster.add(`Selected: ${opt.label}`, 'success'),
    },
    {
      group: 'Actions',
      value: 'action1',
      label: 'Action 1',
      icon: <CheckCircleIcon />,
      selectable: true,
      onSelect: (opt: MenuOption) => toaster.add(`Selected: ${opt.label}`, 'success'),
    },
    {
      value: 'disabled-option',
      label: 'Disabled Option',
      secondaryLabel: 'You cannot click this',
      disabled: true,
      selectable: true,
    },
  ];
};

const BasicMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleAnchorClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  return (
    <>
      <Button handleClick={handleAnchorClick} value = 'menu-button' title='Open menu' />
      <Menu
        open={menuOpen}
        anchor={anchorEl}
        onClose={() => {
          setMenuOpen(false);
          setAnchorEl(null);
        }}
        options={getOptions()}
      />
    </>
  );
};

const TileMenu = () => {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tile
        primary="Context Menu"
        secondary="Click to see options"
        icon={<ListIcon style={{ color: theme.info.main }} />}
        onClick={(e) => {
          const target = (e.currentTarget as HTMLElement);
          setAnchorEl(target);
          setMenuOpen(true);
        }}
      />
      <Menu
        open={menuOpen}
        anchor={anchorEl}
        onClose={() => {
          setMenuOpen(false);
          setAnchorEl(null);
        }}
        options={getOptions()}
      />
    </>
  );
};


export default function Page() {
  const theme = useTheme();

  return (
    <div style={{ maxWidth: '900px' }}>
      <Typography type="h5" style={{ marginBottom: 10 }}>
        Menu Component Showcase
      </Typography>
      <Typography type="body1" style={{ color: theme.text.secondary, marginBottom: 30 }}>
        Examples of how to implement the Menu component with different configurations.
      </Typography>
      <Divider />
      <section style={{ marginTop: 40 }}>
        <Typography type="h6">Standard</Typography>
        <Typography type="body2" style={{ marginBottom: 20 }}>
          Click the button below to trigger a menu anchored to it.
        </Typography>
        <BasicMenu />

        <CodeBlock code = {`
          const getOptions = () => {
            return [
              {
                value: 'option1',
                label: 'Option 1',
                secondaryLabel: 'Description for option 1',
                icon: <ListIcon />,
                selectable: true,
                onSelect: (opt: MenuOption) => toaster.add(\`Selected: \${opt.label}\`, 'success'),
              },
              {
                value: 'option2',
                label: 'Option 2',
                secondaryLabel: 'Description for option 2',
                icon: <InfoIcon />,
                selectable: true,
                onSelect: (opt: MenuOption) => toaster.add(\`Selected: \${opt.label}\`, 'success'),
              },
              {
                group: 'Actions',
                value: 'action1',
                label: 'Action 1',
                icon: <CheckCircleIcon />,
                selectable: true,
                onSelect: (opt: MenuOption) => toaster.add(\`Selected: \${opt.label}\`, 'success'),
              },
              {
                value: 'disabled-option',
                label: 'Disabled Option',
                secondaryLabel: 'You cannot click this',
                disabled: true,
                selectable: true,
              },
            ];
          };

          const BasicMenu = () => {
            const [menuOpen, setMenuOpen] = useState(false);
            const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
            const handleAnchorClick = (event: React.MouseEvent<HTMLElement>) => {
              setAnchorEl(event.currentTarget);
              setMenuOpen(true);
            };

            return (
              <>
                <Button handleClick={handleAnchorClick} value = 'menu-button' title='Open menu' />
                <Menu
                  open={menuOpen}
                  anchor={anchorEl}
                  onClose={() => {
                    setMenuOpen(false);
                    setAnchorEl(null);
                  }}
                  options={getOptions()}
                />
              </>
            );
          };
        `} />
      </section>
      <section style={{ marginTop: 40 }}>
        <Typography type="h5">Tile Interaction</Typography>
        <Typography type="body2" style={{ marginBottom: 20 }}>
          Using a Tile as an anchor for a menu.
        </Typography>
        <div style={{ width: '300px' }}>
          <TileMenu />
        </div>

        <CodeBlock code = {`
          const getOptions = () => {
            return [
              {
                value: 'option1',
                label: 'Option 1',
                secondaryLabel: 'Description for option 1',
                icon: <ListIcon />,
                selectable: true,
                onSelect: (opt: MenuOption) => toaster.add(\`Selected: \${opt.label}\`, 'success'),
              },
              {
                value: 'option2',
                label: 'Option 2',
                secondaryLabel: 'Description for option 2',
                icon: <InfoIcon />,
                selectable: true,
                onSelect: (opt: MenuOption) => toaster.add(\`Selected: \${opt.label}\`, 'success'),
              },
              {
                group: 'Actions',
                value: 'action1',
                label: 'Action 1',
                icon: <CheckCircleIcon />,
                selectable: true,
                onSelect: (opt: MenuOption) => toaster.add(\`Selected: \${opt.label}\`, 'success'),
              },
              {
                value: 'disabled-option',
                label: 'Disabled Option',
                secondaryLabel: 'You cannot click this',
                disabled: true,
                selectable: true,
              },
            ];
          };

          const TileMenu = () => {
            const theme = useTheme();
            const [menuOpen, setMenuOpen] = useState(false);
            const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

            return (
              <>
                <Tile
                  primary="Context Menu"
                  secondary="Click to see options"
                  icon={<ListIcon style={{ color: theme.info.main }} />}
                  onClick={(e) => {
                    const target = (e.currentTarget as HTMLElement);
                    setAnchorEl(target);
                    setMenuOpen(true);
                  }}
                />
                <Menu
                  open={menuOpen}
                  anchor={anchorEl}
                  onClose={() => {
                    setMenuOpen(false);
                    setAnchorEl(null);
                  }}
                  options={getOptions()}
                />
              </>
            );
          };
        `} />
      </section>
    </div>
  );
}
