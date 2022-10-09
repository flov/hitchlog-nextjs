import React, { FC, ReactNode } from 'react';
import { BsFacebook, BsGithub } from 'react-icons/bs';
import NavBar from './NavBar';
import Footer from './Footer';
import { Toast } from 'flowbite-react';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 z-50 ml-auto mr-auto text-center">
        <Toast>
          <div className="text-sm font-normal">Conversation archived.</div>
          <div className="flex items-center ml-auto space-x-2">
            <a
              className="rounded-lg p-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-700"
              href="/toast"
            >
              Undo
            </a>
            <Toast.Toggle />
          </div>
        </Toast>
      </div>
      <NavBar />

      {children}
      <Footer />
    </div>
  );
};

export default Layout;
