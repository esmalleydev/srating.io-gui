import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Markdown from './Markdown';

const Post = (props)  => {
  const post = props.post;

  return (
    <Markdown className="markdown" key = {post.id}>
      {post.content}
    </Markdown>
  );
}

export default Post;
