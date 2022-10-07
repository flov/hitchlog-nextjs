import { Footer } from 'flowbite-react';
import React, { FC } from 'react';
import { BsFacebook, BsGithub } from 'react-icons/bs';

const FooterComponent: FC = () => {
  return (
    <Footer container={true}>
      <div className="flex items-center justify-between w-full">
        <Footer.Copyright href="#" by="Hitchlog™" year={2022} />
        <div className="flex justify-center mt-0 mt-4 space-x-6">
          <Footer.Icon
            href="https://www.facebook.com/hitchlog"
            icon={BsFacebook}
          />
          <Footer.Icon
            href="https://github.com/flov/hitchlog-nextjs"
            icon={BsGithub}
          />
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
