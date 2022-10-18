import { Toast } from 'flowbite-react';
import React, { FC, ReactNode } from 'react';
import NavBar from './NavBar';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="relative">
      <div
        id="portal"
        className="fixed z-50 ml-auto mr-auto text-center top-7 right-7"
      ></div>
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
