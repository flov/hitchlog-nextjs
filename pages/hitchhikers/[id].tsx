import { AxiosResponse } from 'axios';
import { Button, Pagination } from 'flowbite-react';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { useAuth } from '../../src/components/contexts/AuthContext';
import JVectorMap from '../../src/components/JVectorMap';
import { ListTrips } from '../../src/components/ListTrips';
import { getTripsWithQuery } from '../../src/db/trips_new';
import { fetchProfile, getGeomap } from '../../src/db/users';
import { Geomap, Profile, Trip } from '../../src/types';
import { capitalize, profilePicture } from '../../src/utils';
import {
  countryFlagsForProfile,
  showCountryFlagForUser,
  showHitchhikedKms,
  showUserGender,
  viewAverageSpeed,
  viewAverageWaitingTime,
  viewNumberOfComments,
  viewNumberOfRides,
  viewNumberOfStories,
  viewNumberOfTrips,
} from '../../src/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const user = await fetchProfile(params?.id as string);
  const geomap = await getGeomap(params?.id as string);
  console.log({ geomap: geomap.data });
  if (user.data?.error) {
    return {
      notFound: true,
    };
  }
  const trips = await getTripsWithQuery({ q: { user_id_eq: user.data.id } });
  return {
    props: {
      user: JSON.parse(JSON.stringify(user.data)),
      trips: JSON.parse(JSON.stringify(trips.data.trips)),
      geomap: JSON.parse(JSON.stringify(geomap.data)),
      totalPages: JSON.parse(JSON.stringify(trips.data.total_pages)),
    },
  };
};

const Show: NextPage<{
  user: Profile;
  trips: Trip[];
  geomap: Geomap;
  totalPages: number;
}> = (props) => {
  const { user } = props;
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState(props.trips);
  const [totalPages, setTotalPages] = useState(props.totalPages);

  const setTripsData = (res: AxiosResponse) => {
    setTrips(res.data.trips);
    setTotalPages(res.data.total_pages);
  };

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      const res = await getTripsWithQuery({ q: { user_id_eq: user.id }, page });
      setTripsData(res);
      setIsLoading(false);
    };
    fetchTrips();
  }, [page, user.id]);

  const handlePageChange = async (p: number) => {
    router.push(
      {
        pathname: `/hitchhikers/${user.username}`,
        query: { page: p },
      },
      undefined,
      { shallow: true }
    );
    setPage(p);
  };

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-center max-w-5xl px-6 py-8 mx-auto sm:flex-row gap-8">
        <section className="w-full p-6 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
              {capitalize(user.username)}
            </h1>
          </div>

          {user.about_you && <p className="mt-4">{user.about_you}</p>}
          <JVectorMap geomap={props.geomap} />
        </section>
        <div className="w-full p-4 border rounded-lg sm:max-w-xs dark:border-gray-700 dark:bg-gray-800">
          <UserStats user={user} />
        </div>
      </div>

      {trips.length > 0 && (
        <div id="ListTrips">
          <div className="flex justify-center w-full mt-4">
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
              {capitalize(user.username)}&apos;s trips:
            </h2>
          </div>

          <div className="flex justify-center my-4">
            <Pagination
              onPageChange={handlePageChange}
              currentPage={page}
              showIcons={true}
              layout="pagination"
              totalPages={totalPages}
            />
          </div>
          {isLoading ? (
            <div className="p-8 h-96 grid place-items-center">
              <PuffLoader color="blue" />
            </div>
          ) : (
            <div className="px-4">
              <ListTrips trips={trips} map={null} />
            </div>
          )}
          <div className="flex justify-center my-4">
            <Pagination
              onPageChange={handlePageChange}
              currentPage={page}
              showIcons={true}
              layout="pagination"
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </>
  );
};

const UserStats: FC<{ user: Profile }> = ({ user }) => {
  const { currentUser } = useAuth();
  return (
    <>
      <div className="flex justify-center image-shadow">
        <Image
          className="rounded-full shadow shadow-lg"
          alt="Profile picture"
          width={128}
          height={128}
          src={profilePicture(user.md5_email, 128)}
        />
      </div>
      <div className="flex items-center justify-center mt-2 gap-2">
        {capitalize(user.username)} ({user.age})
        {showUserGender(user.gender, 20)}
        {showCountryFlagForUser(user)}
        {user.username === currentUser?.username && (
          <Link passHref href={'/hitchhikers/edit_profile'}>
            <a>
              <Button size="xs">Edit profile</Button>
            </a>
          </Link>
        )}
      </div>
      <div className="flex items-center justify-center pt-2 gap-2">
        {viewNumberOfTrips(user.number_of_trips)}
        {viewNumberOfRides(user.number_of_rides)}
        {viewNumberOfStories(user.number_of_stories)}
        {viewNumberOfComments(user.number_of_comments)}
      </div>
      <div className="flex items-center justify-center pb-2 gap-2">
        {viewAverageSpeed(user.average_speed)}
        {viewAverageWaitingTime(user.average_waiting_time)}
        {showHitchhikedKms(user.hitchhiked_kms)}
      </div>
      <div className="grid grid-auto-fit gap-1">
        {countryFlagsForProfile(user.hitchhiked_countries)}
      </div>
      {user.trustroots && (
        <div className="mt-2">
          Trustroots:{' '}
          <a
            className="text-primary-500"
            href={`https://www.trustroots.org/profile/${user.trustroots}`}
          >
            {user.trustroots}
          </a>
        </div>
      )}
    </>
  );
};

export default Show;
