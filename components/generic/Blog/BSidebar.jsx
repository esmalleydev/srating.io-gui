import React from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const BSidebar = (props)  => {
  const posts = props.posts;

  const router = useRouter();

  return (
    <div style = {{'min-width': 125, 'padding-right': 10}}>
      {posts.map((post) => {
        return (
          <div>
            <Typography style = {{'display': 'block'}} variant = 'caption'>{moment(post.metadata.date).format("MMM DD 'YY")}</Typography>
            <Link style = {{'cursor': 'pointer', 'fontSize': '14px'}} onClick = {() => {router.push('/blog/' + post.id)}}>{post.metadata.title}</Link>
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default BSidebar;
