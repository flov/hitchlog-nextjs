import { NextPage } from 'next';
import React from 'react';

const Custom404: NextPage = () => {
  return (
    <div className="max-w-4xl h-full text-center px-4 py-4 mx-auto align-center justify-center flex flex-col">
      <h2 className="">404</h2>
      <hr className="my-2 w-64 mx-auto" />
      <p>Not all who wonder are lost</p>
    </div>
  );
};

export default Custom404;
