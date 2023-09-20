import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Post } from '../../../src/types/Post';
import { getPost } from '../../../src/db/posts';
import ReactMarkdown from 'react-markdown';
import CommentSection from '../../../src/components/Blog/CommentSection';
import PostComponent from '../../../src/components/Blog/Post';
import { Breadcrumb } from 'flowbite-react';
import { FaHome } from 'react-icons/fa';
import Head from 'next/head';
import { createPostComment } from '../../../src/db/comments';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query?.id as string;

  return {
    props: {
      id,
    },
  };
};

const BlogPost: NextPage<{ id: string }> = ({ id }) => {
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await getPost(id as string);
      setPost(JSON.parse(JSON.stringify(res.data)));
    };
    fetchPost();
  }, []);

  if (!post) return <div>Loading...</div>;

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
