import Image from 'next/image';
import React, { FC } from 'react';

import { Post } from '../../types/Post';
import { timeAgoInWords } from '../../utils/timeAgoInWords';

const PostComponent: FC<{ post: Post }> = ({ post }) => {
  const createdAtDate = new Date(post.created_at);
  return (
    <header className="not-format">
      <address className="flex items-center mb-6 not-italic">
        <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
          <div className="mt-2 mr-4">
            <Image
              width={64}
              height={64}
              className="w-16 h-16 rounded-full"
              src={post.author?.avatar_url}
              alt={post.author?.name}
            />
          </div>
          <div>
            <a
              href="#"
              rel="author"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {post.author?.name}
            </a>
            <p className="text-base font-light text-gray-500 dark:text-gray-400">
              Full Stack Software engineer & Founder of the Hitchlog
            </p>
            <p className="text-base font-light text-gray-500 dark:text-gray-400">
              <time>{timeAgoInWords(createdAtDate)}</time>
            </p>
          </div>
        </div>
      </address>
      <h1 className="text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
        {post.title}
      </h1>
    </header>
  );
};

export default PostComponent;
