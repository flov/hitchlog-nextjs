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
  experiencesForProfile,
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
  const profile = await fetchProfile(params?.id as string);
  const geomap = await getGeomap(params?.id as string);
  if (profile.data?.error) {
    return {
      notFound: true,
    };
  }
  const trips = await getTripsWithQuery({ q: { user_id_eq: profile.data.id } });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile.data)),
      trips: JSON.parse(JSON.stringify(trips.data.trips)),
      geomap: JSON.parse(JSON.stringify(geomap.data)),
      totalPages: JSON.parse(JSON.stringify(trips.data.total_pages)),
    },
  };
};

const Show: NextPage<{
  profile: Profile;
  trips: Trip[];
  geomap: Geomap;
  totalPages: number;
}> = (props) => {
  const { profile } = props;
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

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-center max-w-5xl px-6 py-8 mx-auto sm:flex-row gap-8">
        <section className="w-full p-6 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
              {capitalize(profile.username)}
            </h1>
            {profile.username === currentUser?.username && (
              <Link passHref href={'/hitchhikers/edit_profile'}>
                <a>
                  <Button size="xs">Edit profile</Button>
                </a>
              </Link>
            )}
          </div>

          {profile.about_you && <p className="mt-2">{profile.about_you}</p>}

          {!!profile.experiences && (
            <div className="flex justify-between w-full mt-4">
              {experiencesForProfile(profile.experiences)}
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
          <div className="flex justify-center w-full mt-4">
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
              {capitalize(profile.username)}&apos;s trips:
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

const ProfileStats: FC<{ profile: Profile }> = ({ profile }) => {
  const { currentUser } = useAuth();
  return (
    <>
      <div className="flex justify-center image-shadow">
        <Image
          className="rounded-full shadow shadow-lg"
          alt="Profile picture"
          width={128}
          height={128}
          src={profilePicture(profile.md5_email, 128)}
        />
      </div>
      <div className="flex items-center justify-center mt-4 gap-2">
        {capitalize(profile.username)} ({profile.age})
        {showUserGender(profile.gender, 20)}
        {showCountryFlagForUser(profile)}
      </div>
      <div className="flex items-center justify-center pt-2 gap-2">
        {viewNumberOfTrips(profile.number_of_trips)}
        {viewNumberOfRides(profile.number_of_rides)}
        {viewNumberOfStories(profile.number_of_stories)}
        {viewNumberOfComments(profile.number_of_comments)}
      </div>
      <div className="flex items-center justify-center pb-2 gap-2">
        {viewAverageSpeed(profile.average_speed)}
        {viewAverageWaitingTime(profile.average_waiting_time)}
        {showHitchhikedKms(profile.hitchhiked_kms)}
      </div>
      <div className="grid grid-auto-fit gap-1">
        {countryFlagsForProfile(profile.hitchhiked_countries)}
      </div>
      {profile.trustroots && (
        <div className="mt-2">
          Trustroots:{' '}
          <a
            className="text-primary-500"
            href={
              profile.trustroots.includes('http')
                ? profile.trustroots
                : `https://www.trustroots.org/profile/${profile.trustroots}`
            }
          >
            {profile.trustroots.includes('http')
              ? profile.trustroots.split('/').pop()
              : profile.trustroots}
          </a>
        </div>
      )}
    </>
  );
};

export default Show;
