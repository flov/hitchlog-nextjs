import { AxiosResponse } from 'axios';
import { Avatar, Button, Pagination } from 'flowbite-react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { useAuth } from '../../src/components/contexts/AuthContext';
import MyPagination from '../../src/components/Pagination';
import TripCard from '../../src/components/TripCard';
import { getTripsWithQuery } from '../../src/db/trips_new';
import { fetchProfile } from '../../src/db/users';
import { Profile, Trip } from '../../src/types';
import { capitalize, profilePicture } from '../../src/utils';
import {
  countryFlagsForProfile,
  showCountryFlagForUser,
  showHitchhikedKms,
  viewAverageSpeed,
  viewAverageWaitingTime,
  viewNumberOfComments,
  viewNumberOfRides,
  viewNumberOfStories,
  viewNumberOfTrips,
} from '../../src/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const user = await fetchProfile(params?.id as string);
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
    },
  };
};

const Show: NextPage<{
  user: Profile;
  trips: Trip[];
}> = (props) => {
  const { user } = props;
  const { currentUser } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState(props.trips);
  const [totalPages, setTotalPages] = useState(1);

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
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-2xl dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 sm:p-8">
            <div className="flex justify-center w-full px-4 lg:w-3/12 lg:order-3">
              <div className="relative">
                <img
                  alt="Profile picture"
                  src={profilePicture(user, 150)}
                  className="absolute h-auto max-w-sm -ml-20 align-middle border-none rounded-full shadow-xl -m-28 lg:-ml-16"
                />
              </div>
            </div>
            <div className="flex items-center justify-center pt-12 gap-2">
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                {!!user && capitalize(user.username)}
              </h1>
              {showCountryFlagForUser(user)}
              {user.username === currentUser?.username && (
                <Link passHref href={'/hitchhikers/edit_profile'}>
                  <a>
                    <Button size="xs">Edit profile</Button>
                  </a>
                </Link>
              )}
            </div>
            <div className="flex items-center justify-center py-2 gap-2">
              {viewNumberOfTrips(user.number_of_trips)}
              {viewNumberOfRides(user.number_of_rides)}
              {viewNumberOfStories(user.number_of_stories)}
              {viewNumberOfComments(user.number_of_comments)}
              {viewAverageSpeed(user.average_speed)}
              {viewAverageWaitingTime(user.average_waiting_time)}
              {showHitchhikedKms(user.hitchhiked_kms)}
            </div>
            <div className="grid grid-auto-fit gap-1">
              {countryFlagsForProfile(user.hitchhiked_countries)}
            </div>
            {}

            {user.languages && (
              <div className="mt-2">Languages: {user.languages}</div>
            )}
            {user.cs_user && (
              <div className="mt-2">CouchSurfing: {user.cs_user}</div>
            )}
            {user.trustroots && (
              <div className="mt-2">Trustroots: {user.trustroots}</div>
            )}
            <p className="mt-2">{!!user && user.about_you}</p>
          </div>
        </div>

        <div className="mt-2">
          <Pagination
            onPageChange={handlePageChange}
            currentPage={page}
            showIcons={true}
            layout="pagination"
            totalPages={totalPages}
          />
        </div>

        {isLoading ? (
          <div className="p-8 grid place-items-center">
            <PuffLoader color="blue" />
          </div>
        ) : (
          <div className="mx-auto max-w-7xl">
            <div className="my-4 card-grid">
              {trips.map((trip) => (
                <TripCard trip={trip} key={trip.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Show;
function setTripsData(res: AxiosResponse<any, any>) {
  throw new Error('Function not implemented.');
}
