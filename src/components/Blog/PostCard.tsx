import { Badge, Button } from 'flowbite-react';
import Link from 'next/link';
import React, { FC } from 'react';
import { HiClock } from 'react-icons/hi';
import { Post } from '../../types/Post';
import { pluralize } from '../../utils';
import { timeAgoInWords } from '../../utils/timeAgoInWords';
import Image from 'next/image';
import { useAuth } from '../contexts/AuthContext';

const PostCard: FC<{ post: Post }> = ({ post }) => {
  const createdAt = new Date(post.created_at);
  // divide number of words in string body by 180 to get minutes to read
  const minutesToRead = Math.ceil(post.body.split(' ').length / 180);
  const { currentUser } = useAuth();

  return (
    <article
      key={`post${post.id}`}
      className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-5 text-gray-500">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <div className="flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z"
                  clipRule="evenodd"
                ></path>
                <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
              </svg>
              {post.tag}
            </div>
          </Badge>
          <Badge color="purple">
            <div className="flex items-center">
              <HiClock className="w-3 h-3 mr-1" />
              {minutesToRead} {pluralize(minutesToRead, 'min')} read
            </div>
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">{timeAgoInWords(createdAt)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Link href={`/blog/${post.to_param}`}>
            <a className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {post.title}
            </a>
          </Link>
        </h2>
        {currentUser && currentUser.id === 1 && (
          <Link href={`/blog/${post.to_param}/edit`}>
            <Button size="xs" className="mb-2">
              Edit
            </Button>
          </Link>
        )}
      </div>
      <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
        {post.summary}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/blog/${post.to_param}`}>
            <Image
              width={28}
              height={28}
              className="rounded-full w-7 h-7"
              src={post.author.avatar_url}
              alt={`${post.author.name}'s' avatar`}
            />
          </Link>
          <Link href={`/hitchhikers/${post.author.username}`}>
            <a className="font-medium dark:text-white">{post.author.name}</a>
          </Link>
        </div>
        <Link href={`/blog/${post.to_param}`}>
          <a className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
            Read more
            <svg
              className="w-4 h-4 ml-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
