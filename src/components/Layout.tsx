import React, { FC, ReactNode } from 'react';
import { BsFacebook, BsGithub } from 'react-icons/bs';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
