import { Breadcrumb } from 'flowbite-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { FaHome } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

import CommentSection from '@/components/Blog/CommentSection';
import PostComponent from '@/components/Blog/Post';
import { createPostComment } from '@/db/comments';
import { getPost } from '@/db/posts';
import { Post } from '@/types/Post';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const id = query?.id;

    const res = await getPost(id as string);
    const post = res.data;

    return {
      props: {
        post: JSON.parse(JSON.stringify(post)),
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

const BlogPost: NextPage<{ post: Post }> = ({ post }) => {
  return (
    <main className="pb-16 bg-white lg:pb-24 dark:bg-gray-900">
      <Head>
        <title>{`Hitchlog - ${post.title}`}</title>
      </Head>
      <div className="flex flex-col justify-between max-w-2xl px-4 mx-auto max-w-screen-xl ">
        <Breadcrumb
          aria-label="Solid background breadcrumb example"
          className="py-3 bg-gray-50 dark:bg-gray-900"
        >
          <Breadcrumb.Item href="/'" icon={FaHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/blog">Blog</Breadcrumb.Item>
          <Breadcrumb.Item href={`/blog/${post.to_param}`}>
            {post.title}
          </Breadcrumb.Item>
        </Breadcrumb>

        <article className="w-full mx-auto lg:pt-4">
          <PostComponent post={post} />
          <div className="mb-4 format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
          <CommentSection
            submitCallback={createPostComment}
            comments={post.comments}
            id={post.id}
          />
        </article>
      </div>
    </main>
  );
};

export default BlogPost;
