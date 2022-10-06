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

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [themeSwitcher, setThemeSwitcher] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand href="/">
        <img
          src="https://flowbite.com/docs/images/logo.svg"
          className="h-6 mr-3 sm:h-9"
          alt="Flowbite Logo"
        />
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          Hitchlog
        </span>
      </Navbar.Brand>

      <div className="flex gap-3 md:order-2">
        <Navbar.Toggle />
        {currentUser ? (
          <>
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <Avatar
                  alt="User settings"
                  img={profilePicture(currentUser.username)}
                  rounded={true}
                />
              }
            >
              <Dropdown.Header className="bg-slate-400">
                <span className="block text-sm">
                  <Link href={`/hitchhikers/${currentUser.username}`}>
                    <a className="hover:underline">
                      {capitalize(currentUser.username)}
                    </a>
                  </Link>
                </span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email ? currentUser.email : ''}
                </span>
              </Dropdown.Header>
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
      </div>
      <Navbar.Collapse>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/trips">Trips</Link>
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
