'use client';

import Objector from '@/components/utils/Objector';
import Style from '@/components/utils/Style';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useState } from 'react';

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortDirection?: boolean | string;
  sortable?: boolean
  style?: object;
  sortIconStyle?: object;
  children: React.ReactNode;
  ref?: React.Ref<HTMLTableCellElement>;
}

const Th = (
  {
    sortDirection = false,
    sortable = false,
    style = {},
    sortIconStyle = {},
    children,
    ref,
    ...props
  }: ThProps,
) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerEnter = (e: React.PointerEvent<HTMLTableCellElement>) => {
    setIsHovered(true);
    // Important: Call the function passed by the Tooltip (if it exists)
    if (props.onPointerEnter) {
      props.onPointerEnter(e);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLTableCellElement>) => {
    setIsHovered(false);
    if (props.onPointerLeave) {
      props.onPointerLeave(e);
    }
  };

  const thStyle = Objector.extender(
    {
      fontWeight: '500',
      fontSize: '0.875rem',
      lineHeight: '1.43',
      letterSpacing: '0.01071em',
      display: 'table-cell',
      verticalAlign: 'inherit',
      textAlign: 'left',
      padding: '4px 5px',
      // border: '0px solid',
      cursor: sortable ? 'pointer' : 'initial',
    },
    style,
  );

  const baseIconStyle = Objector.extender(
    {
      fontSize: 16,
      marginLeft: 5,
      transition: 'opacity 0.2s', // Smooth fade in/out
    },
    sortIconStyle,
  );

  let sortIcon: null | React.JSX.Element = null;

  if (sortable) {
    if (sortDirection === 'asc') {
      const activeStyle = Objector.extender(baseIconStyle, sortIconStyle);
      sortIcon = <ArrowUpwardIcon style={activeStyle} />;
    } else if (sortDirection === 'desc') {
      const activeStyle = Objector.extender(baseIconStyle, sortIconStyle);
      sortIcon = <ArrowDownwardIcon style={activeStyle} />;
    } else {
      // Show if hovered, but make it transparent (e.g., opacity 0.5)
      const ghostStyle = Objector.extender(
        baseIconStyle,
        {
          opacity: isHovered ? 0.4 : 0, // 0.4 visible on hover, 0 otherwise
          visibility: isHovered ? 'visible' : 'hidden', // Ensures it doesn't take clicks when hidden
        },
        sortIconStyle,
      ) as React.CSSProperties;

      sortIcon = <ArrowUpwardIcon style = {ghostStyle} />;
    }
  }

  const divStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
  };


  return (
    <th
      className = {Style.getStyleClassName(thStyle)}
      ref = {ref}
      {...props}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className = {Style.getStyleClassName(divStyle)}>
        <span>{children}</span>
        {
          sortIcon
        }
      </div>
    </th>
  );
};

export default Th;
