import {
  Avatar,
  Button,
  DarkThemeToggle,
  Dropdown,
  Modal,
  Navbar,
} from 'flowbite-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from './contexts/AuthContext';
import { capitalize, profilePicture } from '../utils';
import Login from './Login';
import Image from 'next/image';

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [themeSwitcher, setThemeSwitcher] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const hitchlog_logo = '/hitchlog_logo.png';
  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    setThemeSwitcher(true);
  }, []);

  const handleThemeSwitch = () => {
    if (themeSwitcher) {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <Navbar className="border-b border-gray-200 dark:border-0" fluid={true}>
      <Navbar.Brand href="/">
        <div className="ml-2 mr-3">
          <Image
            alt="Vercel logo"
            quality={100}
            src={hitchlog_logo}
            width={19}
            height={27}
          />
        </div>

        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          Hitchlog
        </span>
      </Navbar.Brand>

      <div className="flex gap-3 md:order-2">
        {currentUser ? (
          <>
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <Avatar
                  alt="profile picture"
                  img={profilePicture(currentUser.md5_email)}
                  rounded={true}
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  <Link href={`/hitchhikers/${currentUser.username}`}>
                    {capitalize(currentUser.username)}
                  </Link>
                </span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email ? currentUser.email : ''}
                </span>
              </Dropdown.Header>
              <Dropdown.Item>
                <Link href={`/hitchhikers/${currentUser.username}`}>
                  Your profile
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href="/trips/new">Log new trip</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href="/hitchhikers/edit_profile">Edit Profile</Link>
              </Dropdown.Item>
              <Dropdown.Divider />

              <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <Button onClick={toggleModal}>Login</Button>
        )}
        <DarkThemeToggle onClick={handleThemeSwitch} />
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href='/trips?q=%7B"rides_story_present"%3Atrue%7D'>Trips</Link>
        </li>
        <li>
          <Link href="/blog">Blog</Link>
        </li>
        <li>
          <Link href="/hitchhikers">Hitchhikers</Link>
        </li>
      </Navbar.Collapse>

      <React.Fragment>
        <Modal size="md" show={showModal} onClose={toggleModal}>
          <Modal.Header>Sign in to your account</Modal.Header>
          <Modal.Body>
            <Login toggleModal={toggleModal} />
          </Modal.Body>
        </Modal>
      </React.Fragment>
    </Navbar>
  );
};

export default NavBar;
