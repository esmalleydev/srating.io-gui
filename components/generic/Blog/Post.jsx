import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import { compiler } from 'markdown-to-jsx';

import Sidebar from './Sidebar';

function MarkdownListItem(props) {
  return <Box component="li" sx={{ mt: 1, typography: 'body1' }} {...props} />;
}

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h4',
        component: 'h1',
      },
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h6', component: 'h2' },
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'subtitle1' },
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'caption',
        paragraph: true,
      },
    },
    p: {
      component: Typography,
      props: { paragraph: true },
    },
    a: { component: Link },
    li: {
      component: MarkdownListItem,
    },
  },
  'wrapper': null,
};


const Post = (props)  => {
  const post = props.post;

  const markdown = compiler(post.content, options);

  return (
    <div>
      <Sidebar posts = {props.posts} />
      {markdown}
    </div>
  );
}

export default Post;
