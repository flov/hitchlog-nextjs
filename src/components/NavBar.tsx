import { getAuth } from 'firebase/auth';
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react';
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
          className="mr-3 h-6 sm:h-9"
          alt="Flowbite Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
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
              <Dropdown.Header>
                <span className="block text-sm">{user.displayName}</span>
                <span className="block truncate text-sm font-medium">
                  {user.email ? user.email : ''}
                </span>
              </Dropdown.Header>
              <Dropdown.Item onClick={logOut}>Sign out</Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
          </>
        ) : (
          <Button onClick={signInWithGoogle}>Sign in with Google</Button>
        )}
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active={true}>
          Home
        </Navbar.Link>
        <Navbar.Link href="/map">Map</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
