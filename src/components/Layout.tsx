import Footer from '../flowbite/Footer';
import React, { FC, ReactNode } from 'react';
import NavBar from './NavBar';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="relative">
      <div
        id="portal"
        className="fixed z-50 ml-auto mr-auto text-center top-7 left-7"
      ></div>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
