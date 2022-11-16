import Link from 'next/link';
import React, { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="w-full p-4 bg-white border-t border-gray-200 sm:mt-4 md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        <Link href="/" className="hover:underline">
          Hitchlog
        </Link>
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
        {['Trips', 'Hitchhikers', 'Blog', 'Contact'].map((item) => (
          <li key={item} className="mr-4 hover:underline md:mr-6">
            <Link
              href={`/${item.toLowerCase()}`}
              className="mr-4 hover:underline md:mr-6 "
            >
              {item}
            </Link>
          </li>
        ))}
        {/*
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
