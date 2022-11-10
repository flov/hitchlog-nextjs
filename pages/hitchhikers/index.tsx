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
  viewNumberOfStories,
} from '../../src/utils/viewHelpers';
import { useRouter } from 'next/router';
import { PuffLoader } from 'react-spinners';
import Head from 'next/head';
import Skeleton from '../../src/components/Hitchhikers/Skeleton';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      page: Number(query?.page) || 1,
    },
  };
};

const Index: NextPage<{ page: number }> = (props) => {
  const [page, setPage] = useState(props.page);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data } = await getUsers(page);
    setUsers(data.users);
    setTotalPages(data.total_pages);
    setIsLoading(false);
  };

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
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mx-auto text-center sm:px-4 max-w-screen-lg lg:mb-16">
      <Head>
        <title>Hitchlog - Hitchhikers</title>
      </Head>

      <h1 className="mt-4 text-xl sm:text-4xl sm:mt-8">
        The Glorious Hitchhikers Of The Hitchlog
      </h1>

      <div className="mt-2 mb-4">
        <div className="mb-2 text-sm text-gray-700 dark:text-gray-400">
          Shows only Hitchhikers who have logged trips
          <br />
          Page{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {page}
          </span>{' '}
          of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalPages}
          </span>{' '}
        </div>
        <Pagination
          onPageChange={handlePageChange}
          currentPage={page}
          layout="navigation"
          showIcons={true}
          totalPages={totalPages}
        />
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell>
            <div className="flex justify-between">Username and Stats</div>
          </Table.HeadCell>

          <Table.HeadCell>Member since</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {isLoading ? (
            <>
              {new Array(10).fill(0).map((_, i) => (
                <Table.Row key={`userSkeleton${i}`} className="dark:text-white">
                  <Table.Cell colSpan={2} className="px-2 py-2">
                    <Skeleton />
                  </Table.Cell>
                </Table.Row>
              ))}
            </>
          ) : (
            users.map((user: User, index) => (
              <Table.Row className="dark:text-white" key={`user${index}`}>
                <Table.Cell className="px-3">
                  <div className="flex items-center text-md gap-2 dark:text-white">
                    <Link
                      className="flex items-center gap-2"
                      href={`/hitchhikers/${user.username}`}
                    >
                      <Image
                        alt={`${user.username}'s profile picture`}
                        className="rounded-full"
                        src={profilePicture(user.md5_email)}
                        width={40}
                        height={40}
                      />
                      {user.username}
                    </Link>
                    <div className="flex items-center">
                      ({user.age}
                      {showUserGender(user.gender)})
                    </div>
                    {showNumberOfRides(user.number_of_rides)}
                    {viewNumberOfTrips(user.number_of_trips)}
                    {user.number_of_stories > 0 &&
                      viewNumberOfStories(user.number_of_stories)}
                    {countryFlag(user.location?.country_code)}
                  </div>
                </Table.Cell>
                <Table.Cell>{user.created_at}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      <div className="my-4">
        <Pagination
          onPageChange={handlePageChange}
          currentPage={page}
          layout="table"
          showIcons={true}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Index;
