'use client';

import Typography from '@/components/ux/text/Typography';


export const getTitle = (icon, title) => {
  return (
    <div style = {{ display: 'flex', justifyItems: 'center', alignItems: 'center', lineHeight: 'initial', marginBottom: 12 }}>
      <span style = {{ display: 'flex', marginRight: 5 }}>{icon}</span>
      <Typography type = 'subtitle2'>{title}</Typography>
    </div>
  );
};

export const paperStyle = {
  padding: 16,
};

export const innerBreakPoint = 1200;
