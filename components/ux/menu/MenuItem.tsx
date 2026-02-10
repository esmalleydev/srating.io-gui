'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';

const MenuItem = (
  {
    disabled = false,
    active = false,
    onClick,
    style = {},
    children,
  }:
  {
    disabled?: boolean,
    active?: boolean,
    onClick?: () => void,
    style?: React.CSSProperties;
    children: React.ReactNode;
  },
) => {
  const theme = useTheme();
  const activeColor = theme.mode === 'light' ? theme.grey[100] : theme.grey[800];
  const liStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 0,
    outline: 0,
    margin: 0,
    borderRadius: 0,
    padding: '0px 24px 0px 8px',
    cursor: disabled ? 'default' : 'pointer',
    color: 'inherit',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    minHeight: 48,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
  };

  if (active) {
    liStyle.backgroundColor = activeColor;
  }

  if (disabled) {
    liStyle.pointerEvents = 'none';
    liStyle.opacity = 0.3;
  }

  Objector.extender(liStyle, style);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const hoverCSS = Style.getStyleClassName(`
    &:hover: {
      backgroundColor: ${activeColor},
    },
  `);


  return (
    <li className={`${Style.getStyleClassName(liStyle)} ${hoverCSS}`} tabIndex={-1} onClick={handleClick}>
      {children}
    </li>
  );
};

export default MenuItem;
