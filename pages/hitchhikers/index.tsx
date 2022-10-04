import { Pagination, Table } from 'flowbite-react';
import Image from 'next/image';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getUsers } from '../../src/db/users';
import { User } from '../../src/types';
import { profilePicture } from '../../src/utils';
import {
  countryFlag,
  showNumberOfRides,
  viewNumberOfTrips,
  showUserGender,
} from '../../src/utils/viewHelpers';
import { useRouter } from 'next/router';
import { FaStar } from 'react-icons/fa';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const users = await getUsers(Number(query?.page) || 1);
  if (users.data?.error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      users: JSON.parse(JSON.stringify(users.data.users)),
      page: Number(query?.page) || 1,
      totalPages: JSON.parse(JSON.stringify(users.data.total_pages)),
    },
  };
};

const Index: NextPage<{ totalPages: number; page: number; users: User[] }> = (
  props
) => {
  const [page, setPage] = useState(props.page);
  const [users, setUsers] = useState(props.users);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handlePageChange = async (p: number) => {
    router.push(
      {
        pathname: '/hitchhikers',
        query: { page: p },
      },
      undefined,
      { shallow: true }
    );
    setPage(p);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const { data } = await getUsers(page);
      setUsers(data.users);
      setIsLoading(false);
    };
    fetchUsers();
  }, [page]);

  return (
    <div className="px-4 mx-auto text-center max-w-screen-lg lg:mb-16">
      <h1 className="mt-8 text-4xl">
        The Glorious Hitchhikers Of The Hitchlog
      </h1>

      <div className="mb-4">
        <Pagination
          onPageChange={handlePageChange}
          currentPage={page}
          layout="table"
          showIcons={true}
          totalPages={props.totalPages}
        />
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>
            <div className="flex justify-between">Username</div>
          </Table.HeadCell>
          <Table.HeadCell>
            <FaStar className="inline-block" />
          </Table.HeadCell>

          <Table.HeadCell>Member since</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users.map((user: User, index) => (
            <Table.Row className="dark:text-white" key={`user${index}`}>
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
                  </Link>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                  <div className="flex items-center">
                    ({user.age}
                    {showUserGender(user.gender)})
                  </div>
                  {showNumberOfRides(user.number_of_rides)}
                  {viewNumberOfTrips(user.number_of_trips)}
                  {countryFlag(user.location?.country_code)}
                </div>
              </Table.Cell>
              <Table.Cell>{user.created_at}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="my-4">
        <Pagination
          onPageChange={handlePageChange}
          currentPage={page}
          layout="table"
          showIcons={true}
          totalPages={props.totalPages}
        />
      </div>
    </div>
  );
};

export default Index;
