import Link from 'next/link';
import React, { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="w-full p-4 mt-8 bg-white border-t border-gray-200 md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        <Link href="/" className="hover:underline">
          Hitchlog
        </Link>
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          <Link href="/trips" className="mr-4 hover:underline md:mr-6 ">
            Trips
          </Link>
        </li>
        <li>
          <Link href="/hitchhikers" className="mr-4 hover:underline md:mr-6 ">
            Hitchhikers
          </Link>
        </li>
        {/*
        <li>
          <Link href="/privacy" className="mr-4 hover:underline md:mr-6">
            Privacy
          </Link>
        </li>
        <li>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
        </li>
        */}
      </ul>
    </footer>
  );
};

export default Footer;
