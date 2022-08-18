import { getAuth } from 'firebase/auth';
import {
  Avatar,
  Button,
  DarkThemeToggle,
  Dropdown,
  Navbar,
} from 'flowbite-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { logOut, signInWithGoogle } from '../db/users';
import { useTheme } from 'next-themes';

const NavBar = () => {
  const auth = getAuth();
  const [currentUser] = useAuthState(auth);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleThemeSwitch = () => {
    if (isMounted) {
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
                  img={currentUser?.photoURL as string}
                  rounded={true}
                />
              }
            >
              <Dropdown.Header className="bg-slate-400">
                <span className="block text-sm">{currentUser.displayName}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email ? currentUser.email : ''}
                </span>
              </Dropdown.Header>
              <Dropdown.Item>
                <Link href="/trips/new">Log new trip</Link>
              </Dropdown.Item>
              <Dropdown.Divider />

              <Dropdown.Item onClick={logOut}>Sign out</Dropdown.Item>
            </Dropdown>
          </>
        ) : (
          <Button size="sm" onClick={signInWithGoogle}>
            Sign in
          </Button>
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
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
