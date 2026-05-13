'use client';

import { Tooltip, useTheme, useWindowDimensions } from '@esmalley/react-material-ui';
import { Style } from '@esmalley/ts-utils';

const ClassSpan = (
  { class_year }:
  { class_year: string;},
) => {
  const { width } = useWindowDimensions();

  const theme = useTheme();


  const class_x_color = {
    'Sr.': theme.success[theme.mode],
    'Jr.': theme.info[theme.mode],
    'So.': theme.warning[theme.mode],
    'Fr.': theme.secondary[theme.mode],
  };

  const class_x_name = {
    'Sr.': 'Senior',
    'Jr.': 'Junior',
    'So.': 'Sophomore',
    'Fr.': 'Freshmen',
  };

  const spanStyle: React.CSSProperties = {
    fontSize: '10px',
    margin: '0px 5px',
    padding: '3px',
    borderRadius: '5px',
    backgroundColor: class_year in class_x_color ? class_x_color[class_year] : theme.error.main,
    color: '#fff',
  };


  if (width <= 425) {
    spanStyle.fontSize = '9px';
  }


  return (
    <Tooltip position = 'top' text={(class_year in class_x_name ? class_x_name[class_year] : class_year)}>
      <span className = {Style.getStyleClassName(spanStyle)}>{class_year}</span>
    </Tooltip>
  );
};

export default ClassSpan;
