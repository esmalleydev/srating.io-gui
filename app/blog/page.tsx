import React from 'react';
import { Metadata } from 'next';


import Post from '../../components/generic/Blog/Post';
import { getLastPost, getSidebarPosts } from '../../lib/blog';

export const metadata: Metadata = {
  title: 'sRating | Blog',
  description: 'Information about college basketball statistics and analysis',
  openGraph: {
    title: 'sRating.io Blog',
    description: 'Information about college basketball statistics and analysis',
  },
  twitter: {
    card: 'summary',
    title: 'Information about college basketball statistics and analysis',
  }
};

const Blog = async() => {
  const mainPost = getLastPost();
  const sidebarPosts = getSidebarPosts();


  return (
    <div>
      <div style = {{'padding': 20}}>
        <Post post = {mainPost} posts = {sidebarPosts} />
      </div>
    </div>
  );
}
/*
export async function getServerSideProps(context) {
  const lastPost = getLastPost();
  const sidebarPosts = getSidebarPosts();

  return {
    'props': {
      'data': {
        'main': lastPost,
        'sidebar': sidebarPosts,
      },
      'generated': new Date().getTime(),
    },
  }
};
*/

export default Blog;


