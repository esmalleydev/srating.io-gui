import React from 'react';
import Head from 'next/head';


import Post from '../components/generic/Blog/Post';


import { getLastPost, getSidebarPosts } from '../lib/blog';



const Blog = (props) => {
  const mainPost = props.data.main;
  const sidebarPosts = props.data.sidebar;


  return (
    <div>
      <Head>
        <title>sRating | Blog</title>
        <meta name = 'description' content = 'srating Blog | information about college basketball statistics' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball rankings" />
        <meta property="og:description" content="srating Blog | information about college basketball statistics" />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = 'srating Blog | information about college basketball statistics' />
      </Head>
      <div style = {{'padding': 20}}>
        <Post post = {mainPost} posts = {sidebarPosts} />
      </div>
    </div>
  );
}

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

export default Blog;


