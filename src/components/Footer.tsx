import { Footer } from 'flowbite-react';
import React, { FC } from 'react';
import { BsFacebook, BsGithub } from 'react-icons/bs';

const FooterComponent: FC = () => {
  return (
    <Footer container={true}>
      <div className="w-full">
        <div className="justify-between w-full grid sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="/"
              src="https://flowbite.com/docs/images/logo.svg"
              alt="Hitchlog Logo"
              name="Hitchlog"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col={true}>
                <Footer.Link href="#">Hitchlog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col={true}>
                <Footer.Link href="https://github.com/flov/hitchlog-nextjs">
                  Github
                </Footer.Link>
                <Footer.Link href="https://fb.com/hitchlog">
                  Facebook
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Hitchlog™" year={2022} />
          <div className="flex mt-4 space-x-6 sm:mt-0 sm:justify-center">
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
      </div>
    </Footer>
  );
};

export default FooterComponent;
