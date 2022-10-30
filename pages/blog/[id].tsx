import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { Post } from '../../src/types/Post';
import { getPost, getPostComments } from '../../src/db/posts';
import ReactMarkdown from 'react-markdown';
import { timeAgoInWords } from '../../src/utils/timeAgoInWords';
import CommentSection from '../../src/components/Blog/CommentSection';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id;
  const post = await getPost(id as string);

  return {
    props: {
      post: JSON.parse(JSON.stringify(post.data)),
    },
  };
};

const BlogPost: NextPage<{ post: Post }> = ({ post }) => {
  const createdAtDate = new Date(post.created_at);
  console.log({ post });

  return (
    <>
      <main className="pt-8 pb-16 bg-white lg:pt-16 lg:pb-24 dark:bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
          <article className="w-full max-w-2xl mx-auto format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <header className="mb-4 lg:mb-6 not-format">
              <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                  <img
                    className="w-16 h-16 mr-4 rounded-full"
                    src={post.author.avatar_url}
                    alt={post.author.name}
                  />
                  <div>
                    <a
                      href="#"
                      rel="author"
                      className="text-xl font-bold text-gray-900 dark:text-white"
                    >
                      {post.author.name}
                    </a>
                    <p className="text-base font-light text-gray-500 dark:text-gray-400">
                      Software engineer & Founder of the Hitchlog
                    </p>
                    <p className="text-base font-light text-gray-500 dark:text-gray-400">
                      <time>{timeAgoInWords(createdAtDate)}</time>
                    </p>
                  </div>
                </div>
              </address>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                {post.title}
              </h1>
            </header>
            <ReactMarkdown>{post.body}</ReactMarkdown>
            <CommentSection post={post} />
          </article>
        </div>
      </main>
    </>
  );
};

export default BlogPost;
