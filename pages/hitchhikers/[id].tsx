import { AxiosResponse } from 'axios';
import { Alert, Button, Pagination } from 'flowbite-react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import JVectorMap from '@/components/JVectorMap';
import { ListTrips } from '@/components/ListTrips';
import { useAuth } from '@/components/contexts/AuthContext';
import VehiclesForProfile from '@/components/helpers/VehiclesForProfile';
import ProfileStats from '@/components/users/ProfileStats';
import { getTripsWithQuery } from '@/db/trips';
import { fetchProfile, getGeomap } from '@/db/users';
import { Geomap, Profile, Trip } from '@/types';
import { capitalize } from '@/utils';
import { experiencesForProfile } from '@/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async ({
  query,
  params,
}) => {
  try {
    const profile = await fetchProfile(params?.id as string);
    const geomap = await getGeomap(params?.id as string);
    const page = query.page ? JSON.parse(query.page as string) : 1;
    const trips = await getTripsWithQuery({
      q: { user_id_eq: profile.data.id },
    });
    return {
      props: {
        profile: JSON.parse(JSON.stringify(profile.data)),
        trips: JSON.parse(JSON.stringify(trips.data.trips)),
        geomap: JSON.parse(JSON.stringify(geomap.data)),
        totalPages: JSON.parse(JSON.stringify(trips.data.total_pages)),
        page,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

const Show: NextPage<{
  profile: Profile;
  trips: Trip[];
  geomap: Geomap;
  totalPages: number;
  page: number;
}> = (props) => {
  const { profile } = props;
  const router = useRouter();
  const [page, setPage] = useState(props.page);
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
      const res = await getTripsWithQuery({
        q: { user_id_eq: profile.id },
        page,
      });
      setTripsData(res);
      setIsLoading(false);
    };
    fetchTrips();
  }, [page, profile.id]);

  const handlePageChange = async (p: number) => {
    router.push(
      {
        pathname: `/hitchhikers/${profile.username}`,
        query: { page: p },
      },
      undefined,
      { shallow: true }
    );
    setPage(p);
  };

  const { currentUser } = useAuth();
  const isOwner = profile.username === currentUser?.username;

  return (
    <>
      <Head>
        <title>{`Hitchlog - ${profile.username}'s profile`}</title>
      </Head>

      <div className="flex flex-col-reverse items-start justify-center max-w-5xl px-4 pt-4 mx-auto sm:flex-row gap-4">
        <section className="w-full p-6 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center justify-between sm:flex-row gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {capitalize(profile.username)}
            </h1>
            {isOwner && (
              <div className="flex gap-2">
                <Link passHref href={'/hitchhikers/edit_profile'}>
                  <Button size="xs">Edit profile</Button>
                </Link>
                <Link passHref href={'/trips/new'}>
                  <Button color="purple" size="xs">
                    Log new trip
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {profile.number_of_trips == 0 && (
            <div className="mt-2">
              <Alert color="info">
                <span className="font-medium">
                  {isOwner ? 'You have' : `${capitalize(profile.username)} has`}{' '}
                  not logged any trips yet.
                  {isOwner && (
                    <>
                      <br />
                      Log your first trip by clicking the button above.
                    </>
                  )}
                </span>
              </Alert>
            </div>
          )}

          {profile.about_you && (
            <div className="mt-4 format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
              <ReactMarkdown>{profile.about_you}</ReactMarkdown>
            </div>
          )}

          {!!profile.experiences && (
            <div className="flex justify-between w-full mt-8">
              {experiencesForProfile(profile.experiences)}
            </div>
          )}
          {profile.vehicles && !!Object.keys(profile.vehicles) && (
            <div className="flex justify-between w-full mt-8">
              <VehiclesForProfile vehicles={profile.vehicles} />
            </div>
          )}

          {props.geomap && !!Object.keys(props.geomap.distances).length && (
            <div className="mt-4">
              <JVectorMap geomap={props.geomap} />
            </div>
          )}
        </section>
        <div className="w-full p-4 border rounded-lg sm:max-w-xs dark:border-gray-700 dark:bg-gray-800">
          <ProfileStats profile={profile} />
        </div>
      </div>

      {trips.length > 0 && (
        <div id="ListTrips">
          <div className="flex justify-center w-full my-4 sm:my-6">
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
              {capitalize(profile.username)}&apos;s trips:
            </h2>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mb-4">
              <Pagination
                onPageChange={handlePageChange}
                currentPage={page}
                showIcons={true}
                layout="pagination"
                totalPages={totalPages}
              />
            </div>
          )}
          <div className="px-4">
            <ListTrips isLoading={isLoading} trips={trips} map={null} />
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
        </div>
      )}
    </>
  );
};

export default Show;
