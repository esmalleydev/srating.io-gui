import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';

import Post from '@/components/generic/Blog/Post';

import { getAllPostIds, getPostData, getSidebarPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>
}


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parameters = await params;
  const blogData = await getData(parameters);
  const data = blogData.post;
  const { metadata } = data;

  return {
    title: `sRating | Blog | ${metadata.title}`,
    description: metadata.excerpt,
    openGraph: {
      title: metadata.title,
      description: metadata.excerpt,
    },
    twitter: {
      card: 'summary',
      title: metadata.title,
    },
  };
}

const Blog = async ({ params }: Props) => {
  const parameters = await params;
  const blogData = await getData(parameters);

  const data = blogData.post;

  const sidebarPosts = blogData.sidebar;

  return (
    <div>
      <div style = {{ display: 'flex', padding: 20 }}>
        <Post post = {data} posts = {sidebarPosts} />
      </div>
    </div>
  );
};

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return [{
    paths,
    fallback: false,
  }];
}

async function getData(params) {
  const postData = getPostData(params.id);
  const sidebarPosts = getSidebarPosts();
  return {
    post: postData,
    sidebar: sidebarPosts,
  };
}


export default Blog;
