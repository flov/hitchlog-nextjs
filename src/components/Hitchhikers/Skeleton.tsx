import React, { FC } from 'react';

const Skeleton: FC = () => {
  return (
    <div role="status" className="animate-pulse dark:border-gray-700">
      <div className="flex items-center mr-4 space-x-3">
        <svg
          className="text-gray-200 w-14 h-14 dark:text-gray-700"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          ></path>
        </svg>
        <div className="flex items-center justify-between w-full">
          <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          <div className="hidden w-48 h-2 bg-gray-200 rounded-full sm:block dark:bg-gray-700"></div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Skeleton;
