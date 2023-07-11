import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Post from '../../components/generic/Blog/Post';

import { getAllPostIds, getPostData, getSidebarPosts } from '../../lib/blog';


const Blog = (props) => {
  const self = this;
  const router = useRouter();


  const data = props.post;

  const sidebarPosts = props.sidebar

  const post = data.content;

  const metadata = data.metadata;


  return (
    <div>
      <Head>
        <title>sRating | Blog | {metadata.title}</title>
        <meta name = 'description' content = {metadata.excerpt} key = 'desc'/>
        <meta property="og:title" content = {metadata.title} />
        <meta property="og:description" content = {metadata.excerpt} />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = {metadata.title} />
      </Head>
      <div style = {{'display': 'flex', 'padding': 20}}>
        <Post post = {data} posts = {sidebarPosts} />
      </div>
    </div>
  );
}



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


export default Blog;