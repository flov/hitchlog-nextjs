import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { Post } from '../../../src/types/Post';
import { getPost } from '../../../src/db/posts';
import ReactMarkdown from 'react-markdown';
import CommentSection from '../../../src/components/Blog/CommentSection';
import PostComponent from '../../../src/components/Blog/Post';
import { Breadcrumb } from 'flowbite-react';
import { FaHome } from 'react-icons/fa';

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
          <CommentSection comments={post.comments} postId={post.id} />
        </article>
      </div>
    </main>
  );
};

export default BlogPost;
