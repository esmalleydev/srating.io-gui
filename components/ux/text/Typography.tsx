'use client';

import { useTheme } from '@/components/hooks/useTheme';
import Style from '@/components/utils/Style';

const Typography = (
  {
    children,
    type,
    style = {},
    ...props
  }:
  {
    children: React.ReactNode;
    type: string;
    style?: React.CSSProperties;
  },
) => {
  const theme = useTheme();

  const getBaseStyle = (): React.CSSProperties => {
    if (type === 'a') {
      return {
        color: theme.link.primary,
      };
    }
    if (type === 'h1') {
      return {
        fontWeight: 300,
        fontSize: '6rem',
        lineHeight: 1.167,
        letterSpacing: '-0.01562em',
      };
    }
    if (type === 'h2') {
      return {
        fontWeight: 300,
        fontSize: '3.75rem',
        lineHeight: 1.2,
        letterSpacing: '-0.00833em',
      };
    }
    if (type === 'h3') {
      return {
        fontSize: '3rem',
        lineHeight: 1.167,
        letterSpacing: '0em',
      };
    }
    if (type === 'h4') {
      return {
        fontSize: '2.125rem',
        lineHeight: 1.235,
        letterSpacing: '0.00735em',
      };
    }
    if (type === 'h5') {
      return {
        fontSize: '1.5rem',
        lineHeight: 1.334,
        letterSpacing: '0em',
      };
    }
    if (type === 'h6') {
      return {
        fontWeight: 500,
        fontSize: '1.25rem',
        lineHeight: 1.6,
        letterSpacing: '0.0075em',
      };
    }
    if (type === 'subtitle1') {
      return {
        fontSize: '1rem',
        lineHeight: 1.75,
        letterSpacing: '0.00938em',
      };
    }
    if (type === 'subtitle2') {
      return {
        fontWeight: 500,
        fontSize: '0.875rem',
        lineHeight: 1.57,
        letterSpacing: '0.00714em',
      };
    }
    if (type === 'body1') {
      return {
        fontSize: '1rem',
        lineHeight: 1.5,
        letterSpacing: '0.00938em',
      };
    }
    if (type === 'body2') {
      return {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        letterSpacing: '0.01071em',
      };
    }
    if (type === 'caption') {
      return {
        fontSize: '0.75rem',
        lineHeight: 1.66,
        letterSpacing: '0.03333em',
        display: 'block',
      };
    }
    if (type === 'overline') {
      return {
        fontSize: '0.75rem',
        lineHeight: 2.66,
        letterSpacing: '0.08333em',
        textTransform: 'uppercase',
        display: 'block',
      };
    }
    return {};
  };

  const cStyle: React.CSSProperties = {
    color: theme.text.primary,
    padding: 0,
    margin: 0,
    fontWeight: 400,
    ...getBaseStyle(),
    ...style,
  };

  const types = {
    a: 'a',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'h6',
    subtitle2: 'h6',
    body1: 'p',
    body2: 'p',
    caption: 'span',
    overline: 'span',
    inherit: 'p',
  };


  const Tag = types[type] || 'p'; // Ensure a default fallback

  return (
    <Tag className ={Style.getStyleClassName(cStyle)} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;
