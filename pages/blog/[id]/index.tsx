import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { Post } from '../../../src/types/Post';
import { getPost } from '../../../src/db/posts';
import ReactMarkdown from 'react-markdown';
import CommentSection from '../../../src/components/Blog/CommentSection';
import PostComponent from '../../../src/components/Blog/Post';

export const getStaticProps: GetStaticProps = async ({ query }) => {
  try {
    const id = query.id;
    const post = await getPost(id as string);

    return {
      props: {
        post: JSON.parse(JSON.stringify(post.data)),
      },
    };
  } catch (error) {
    return {
      props: {
        post: null,
      },
    };
  }
};

const BlogPost: NextPage<{ post: Post }> = ({ post }) => {
  return (
    <>
      <main className="pt-8 pb-16 bg-white lg:pt-16 lg:pb-24 dark:bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
          <article className="w-full max-w-2xl mx-auto ">
            <PostComponent post={post} />
            <div className="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
              <ReactMarkdown>{post.body}</ReactMarkdown>
            </div>
            <CommentSection comments={post.comments} />
          </article>
        </div>
      </main>
    </>
  );
};

export default BlogPost;
