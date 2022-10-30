import React, { FC } from 'react';
import { Comment } from '../../types/Comment';
import CommentComponent from './Comment';

const CommentSection: FC<{ comments: Comment[] }> = ({ post }) => {
  const comments = post.comments;

  return (
    <div>
      <section className="not-format">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
            Discussion ({comments.length})
          </h2>
        </div>
        <form className="mb-6">
          <div className="px-4 py-2 mb-4 bg-white border border-gray-200 rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              rows={6}
              className="w-full px-0 text-sm text-gray-900 border-0 focus:ring-0 dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
              placeholder="Write a comment..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Post comment
          </button>
        </form>

        {comments.map((comment: Comment) => (
          <CommentComponent key={comment.created_at} comment={comment} />
        ))}
      </section>
    </div>
  );
};

export default CommentSection;
