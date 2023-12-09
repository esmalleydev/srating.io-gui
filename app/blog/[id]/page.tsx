import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';

import Post from '../../../components/generic/Blog/Post';

import { getAllPostIds, getPostData, getSidebarPosts } from '../../../lib/blog';


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

const Blog = async({ params }) => {
  const self = this;

  const blogData = await getData(params);

  const data = blogData.post;

  const sidebarPosts = blogData.sidebar

  const post = data.content;

  const metadata = data.metadata;


  return (
    <div>
      {/* <Head>
        <title>sRating | Blog | {metadata.title}</title>
        <meta name = 'description' content = {metadata.excerpt} key = 'desc'/>
        <meta property="og:title" content = {metadata.title} />
        <meta property="og:description" content = {metadata.excerpt} />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = {metadata.title} />
      </Head> */}
      <div style = {{'display': 'flex', 'padding': 20}}>
        <Post post = {data} posts = {sidebarPosts} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return [{
    paths,
    fallback: false
  }];
};

async function getData(params) {
  const postData = getPostData(params.id);
  const sidebarPosts = getSidebarPosts();
  return {
    'post': postData,
    'sidebar': sidebarPosts
  };
};

/*
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false
  }
};

export async function getStaticProps({ params }) {
  const postData = getPostData(params.id);
  const sidebarPosts = getSidebarPosts();
  return {
    'props': {
      'post': postData,
      'sidebar': sidebarPosts
    }
  }
};
*/


export default Blog;