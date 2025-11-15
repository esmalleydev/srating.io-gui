'use client';

import Typography from '@/components/ux/text/Typography';
import { useTheme } from '@/components/hooks/useTheme';
import Dates from '@/components/utils/Dates';


const Sidebar = ({ sidebarPosts }) => {
  const theme = useTheme();

  return (
    <div style = {{ minWidth: 125, float: 'right', marginTop: 10, marginLeft: 10, textAlign: 'right' }}>
      <Typography type = 'h6'>Posts</Typography>
      <hr />
      {sidebarPosts.map((post, index) => {
        return (
          <div key = {index}>
            <Typography style = {{ display: 'block' }} type = 'caption'>{Dates.format(Dates.parse(post.metadata.date), "M j 'y")}</Typography>
            <a style = {{ cursor: 'pointer', fontSize: '14px', color: theme.link.primary }} href = {`/blog/${post.id}`}>{post.metadata.title}</a>
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
