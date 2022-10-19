import { AxiosResponse } from 'axios';
import { Alert, Button, Pagination } from 'flowbite-react';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { useAuth } from '../../src/components/contexts/AuthContext';
import VehiclesForProfile from '../../src/components/helpers/VehiclesForProfile';
import JVectorMap from '../../src/components/JVectorMap';
import { ListTrips } from '../../src/components/ListTrips';
import ProfileStats from '../../src/components/users/ProfileStats';
import { getTripsWithQuery } from '../../src/db/trips';
import { fetchProfile, getGeomap } from '../../src/db/users';
import { Geomap, Profile, Trip } from '../../src/types';
import { capitalize } from '../../src/utils';
import { experiencesForProfile } from '../../src/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async ({
  query,
  params,
}) => {
  const profile = await fetchProfile(params?.id as string);
  const geomap = await getGeomap(params?.id as string);
  const page = query.page ? JSON.parse(query.page as string) : 1;

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
      page,
    },
  };
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

  return (
    <>
      <div className="flex flex-col-reverse items-start justify-center max-w-5xl px-6 pt-8 mx-auto sm:flex-row sm:gap-8 gap-4">
        <section className="w-full p-6 border rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
              {capitalize(profile.username)}
            </h1>
            {profile.username === currentUser?.username && (
              <>
                <Link passHref href={'/hitchhikers/edit_profile'}>
                  <a>
                    <Button size="xs">Edit profile</Button>
                  </a>
                </Link>
                <Link passHref href={'/trips/new'}>
                  <a>
                    <Button color="warning" size="xs">
                      Log new trip
                    </Button>
                  </a>
                </Link>
              </>
            )}
          </div>

          {profile.number_of_trips == 0 && (
            <div className="mt-2">
              <Alert color="info">
                <span className="font-medium">
                  {capitalize(profile.username)} has not added any trips yet.
                </span>
              </Alert>
            </div>
          )}

          {profile.about_you && <p className="mt-2">{profile.about_you}</p>}

          {!!profile.experiences && (
            <div className="flex justify-between w-full mt-4">
              {experiencesForProfile(profile.experiences)}
            </div>
          )}
          {!!profile.vehicles && (
            <div className="flex justify-between w-full mt-4">
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
          <div className="flex justify-center w-full my-2 sm:mt-4">
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
              {capitalize(profile.username)}&apos;s trips:
            </h2>
          </div>

          <div className="flex justify-center mb-4 overflow-x-scroll">
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
              <ListTrips isLoading={isLoading} trips={trips} map={null} />
            </div>
          )}
          <div className="flex justify-center my-4 overflow-x-scroll">
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
