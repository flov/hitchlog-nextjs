import React, { FC, ReactNode } from 'react';
import NavBar from './NavBar';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="relative">
      <div id="portal"></div>
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
