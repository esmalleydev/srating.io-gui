
'use server';

import { compiler } from 'markdown-to-jsx';

import Sidebar from './Sidebar';
import Typography from '@/components/ux/text/Typography';

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        type: 'h4',
        style: {
          marginBottom: 10,
        },
      },
    },
    h2: {
      component: Typography,
      props: {
        type: 'h6',
        style: {
          marginBottom: 10,
        },
      },
    },
    h3: {
      component: Typography,
      props: {
        type: 'subtitle1',
        style: {
          marginBottom: 10,
        },
      },
    },
    h4: {
      component: Typography,
      props: {
        type: 'caption',
        style: {
          marginBottom: 10,
        },
      },
    },
    p: {
      component: Typography,
      props: {
        type: 'p',
        style: {
          marginBottom: 10,
        },
      },
    },
    a: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component: 'a' as any,
      props: {
        target: '_blank',
        style: { color: '#90caf9' },
      },
    },
  },
  wrapper: null,
};

const Post = async ({ post, sidebarPosts }) => {
  const markdown = compiler(post.content, options);

  return (
    <div style = {{ width: '100%' }}>
      <Sidebar sidebarPosts = {sidebarPosts} />
      <div style = {{ maxWidth: 800, margin: 'auto' }}>
        {markdown}
      </div>
    </div>
  );
};

export default Post;
