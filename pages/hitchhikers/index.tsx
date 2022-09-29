import { Table } from 'flowbite-react';
import Image from 'next/image';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { getUsers } from '../../src/db/users';
import { User } from '../../src/types';
import { profilePicture } from '../../src/utils';
import {
  showNumberOfRides,
  showNumberOfTrips,
  showUserGender,
} from '../../src/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const users = await getUsers();
  if (users.data?.error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      users: JSON.parse(JSON.stringify(users.data)),
    },
  };
};

const Index: NextPage<{ users: User[] }> = ({ users }) => {
  console.log({ users });
  return (
    <div className="mx-auto text-center max-w-screen-lg lg:mb-16">
      <h1 className="my-8 text-2xl">Hitchhikers</h1>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Member since</Table.HeadCell>
          <Table.HeadCell>View Profile</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users.map((user: any, index) => (
            <Table.Row key={`user${index}`}>
              <Table.Cell>
                <div className="flex items-center text-md gap-2 dark:text-white">
                  <Link href={`/hitchhikers/${user.username}`}>
                    <a className="flex items-center gap-2">
                      <Image
                        alt={`${user.username}'s profile picture`}
                        className="rounded-full"
                        src={profilePicture(user)}
                        width={40}
                        height={40}
                      />
                      {user.username}
                    </a>
                  </Link>{' '}
                  <div className="flex items-center">
                    ({user.age}
                    {showUserGender(user.gender)})
                  </div>
                  {showNumberOfRides(user.number_of_rides)}
                  {showNumberOfTrips(user.number_of_trips)}
                </div>
              </Table.Cell>
              <Table.Cell>{user.created_at}</Table.Cell>
              <Table.Cell>
                <Link href={`/hitchhikers/${user.username}`}>View Profile</Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Index;
