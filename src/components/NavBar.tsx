import { getAuth } from 'firebase/auth';
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
import Link from 'next/link';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { logOut, signInWithGoogle } from '../db/users';

const NavBar = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);

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
      <div className="flex md:order-2">
        {user ? (
          <>
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={
                <Avatar
                  alt="User settings"
                  img={user?.photoURL as string}
                  rounded={true}
                />
              }
            >
              <Dropdown.Header className="bg-slate-400">
                <span className="block text-sm">{user.displayName}</span>
                <span className="block text-sm font-medium truncate">
                  {user.email ? user.email : ''}
                </span>
              </Dropdown.Header>
              <Dropdown.Item>
                <Link href="/trips/new">Log new trip</Link>
              </Dropdown.Item>
              <Dropdown.Divider />

              <Dropdown.Item onClick={logOut}>Sign out</Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
          </>
        ) : (
          <Button onClick={signInWithGoogle}>Sign in with Google</Button>
        )}
      </div>
      <Navbar.Collapse>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/map">Map</Link>
        </li>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
