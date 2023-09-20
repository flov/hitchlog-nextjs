import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import PostCard from '../../src/components/Blog/PostCard';
import { getPosts } from '../../src/db/posts';
import { Post } from '../../src/types/Post';

const Blog: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts();
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  if (!posts) return null;

  return (
    <>
      <Head>
        <title>Hitchlog - Blog</title>
      </Head>

      <section className="bg-white dark:bg-gray-900">
        <div className="px-4 py-8 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto mb-8 text-center max-w-screen-sm lg:mb-16">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl dark:text-white">
              Blog
            </h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              Here we write about everything related with hitchhiking and the
              Hitchlog. If you feel like promoting a hitchhiking related event,
              or would like to make a guest post, please{' '}
              <Link className="text-blue-500" href="/contact">
                get in touch
              </Link>
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
