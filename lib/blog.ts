import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'blog');

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData: any = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }
    return -1;
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    return {
      id,
      metadata: matterResult.data,
      content: matterResult.content,
    };
  }

  return {
    id,
    metadata: { title: 'Unknown' },
    content: '404',
  };
}


/**
 * Get the last post by date
 * @return {Object} postData {id: foo, metadata: {...}, content: bar}
 */
export function getLastPost() {
  const posts = getAllPostIds();

  let lastPost = null;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postData = getPostData(post.params.id);

    if (!postData || !postData.metadata || !postData.metadata.date) {
      continue;
    }

    if (
      !lastPost ||
      (
        postData.metadata &&
        postData.metadata.date &&
        postData.metadata.date > lastPost.metadata.date
      )
    ) {
      lastPost = postData;
    }
  }

  return lastPost;
}

export function getSidebarPosts() {
  const posts = getAllPostIds();

  const lastTenPosts = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postData = getPostData(post.params.id);

    if (!postData || !postData.metadata || !postData.metadata.date) {
      continue;
    }

    delete postData.content;

    lastTenPosts.push(postData);
  }

  const sortedPosts = lastTenPosts.sort((a, b) => {
    return a.metadata.date > b.metadata.date ? -1 : 1;
  });

  return sortedPosts.splice(0, 10);
}

