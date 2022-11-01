import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import Image from 'next/image';
import { Comment } from '../../types/Comment';
import moment from 'moment';
import { timeAgoInWords } from '../../utils/timeAgoInWords';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const CommentComponent: NextPage<{ comment: Comment }> = ({ comment }) => {
  const createdAt = new Date(comment.created_at);
  // createdAt is less than 30 days ago
  const isRecent = moment(createdAt).isAfter(moment().subtract(30, 'days'));
  const createdAtHumanReadable = moment(createdAt).format('MMMM Do YYYY');

  return (
    <article className="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
      <footer className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-2 text-sm text-gray-900 gap-2 dark:text-white">
            <Image
              className="w-6 h-6 rounded-full"
              width={24}
              height={24}
              src={comment.author.avatar_url}
              alt={comment.author.name}
            />
            <Link href={`/hitchhikers/${comment.author.username}`}>
              {comment.author.name}
            </Link>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time title={createdAtHumanReadable}>
              {isRecent ? timeAgoInWords(createdAt) : createdAtHumanReadable}
            </time>
          </p>
        </div>
      </footer>
      <p>{comment.body}</p>
    </article>
  );
};

export default CommentComponent;
