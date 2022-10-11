import React, { FC, ReactNode } from 'react';
import { BsFacebook, BsGithub } from 'react-icons/bs';
import NavBar from './NavBar';
import Footer from './Footer';
import { Toast } from 'flowbite-react';
import { useToasts } from './contexts/ToastContext';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="relative">
      <div id="portal"></div>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
