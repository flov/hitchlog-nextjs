import { GetServerSideProps } from 'next';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import OverlayContainer from '../../src/components/OverlayContainer';
import OverlayBubble from '../../src/components/OverlayBubble';
import { Trip } from '../../src/types';
import { ListTrips } from '../../src/components/ListTrips';
import { getTripsWithQuery } from '../../src/db/trips';
import LoadingContainer from '../../src/components/LoadingContainer';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import SearchForm from '../../src/components/SearchForm';
import { Pagination } from 'flowbite-react';
import { FaList, FaMap } from 'react-icons/fa';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q = query.q ? JSON.parse(query.q as string) : {};
  const page = query.page ? JSON.parse(query.page as string) : 1;

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      q,
      page,
    },
  };
};

const Index: FC<{
  google: GoogleAPI;
  q: any;
  page: number;
}> = (props) => {
  const { google } = props;
  let q = props.q;
  if (typeof q === 'string') q = JSON.parse(q);
  const googleMapsRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState({});
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(props.page);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const handlePageChange = async (p: number) => {
    router.push(
      {
        pathname: '/trips',
        query: { page: p, q: JSON.stringify(query) },
      },
      undefined,
      { shallow: true }
    );
    setPage(p);
    const fetchTrips = async () => {
      setIsLoading(true);
      const res = await getTripsWithQuery({
        q: Object.assign(query),
        page,
      });
      setTrips(res.data.trips);
      setTotalPages(res.data.total_pages);
      setIsLoading(false);
    };
    fetchTrips();
  };

  useEffect(() => {
    getTripsWithQuery({ q: props.q as Record<string, any> }).then((res) => {
      setTrips(res.data.trips);
      setTotalPages(res.data.total_pages);
      setIsLoading(false);
    });
    setQuery(props.q);

    if (googleMapsRef.current) {
      let createdMap = new google.maps.Map(googleMapsRef.current, {
        center: { lat: 50.85045, lng: 4.34878 },
        zoom: 6,
      });
      setMap(createdMap);

      google.maps.event.addListener(createdMap, 'dragend', function () {
        const bounds = createdMap.getBounds();
        const ne = bounds?.getNorthEast();
        const sw = bounds?.getSouthWest();
        const northLat = ne?.lat() as number;
        const southLat = sw?.lat() as number;
        const westLng = sw?.lng() as number;
        const eastLng = ne?.lng() as number;
        //do whatever you want with those bounds
        if (!ne || !sw) return;
        setIsLoading(true);
        getTripsWithQuery({
          q: Object.assign(query, {
            from_lat_lt: northLat,
            from_lat_gt: southLat,
            from_lng_gt: westLng,
            from_lng_lt: eastLng,
          }),
        }).then((res: AxiosResponse) => {
          setIsLoading(false);
          setTrips(res.data.trips);
          setTotalPages(res.data.total_pages);

          setQuery(Object.assign(query, res.config.params.q));
          router.push(
            {
              pathname: '/trips',
              query: {
                q: JSON.stringify(res.config.params.q),
              },
            },
            undefined,
            { shallow: true }
          );
        });
      });
    }
  }, []);

  const [isShowingMap, setIsShowingMap] = useState(false);

  return (
    <>
      <Head>
        <title>Hitchlog - Hitchhiking Trips</title>
      </Head>

      <div
        className="fixed z-10 flex items-center justify-center p-2 cursor-pointer gap-2 left-1/2 fixed-button"
        onClick={() => setIsShowingMap(!isShowingMap)}
      >
        {isShowingMap ? (
          <>
            <FaList />
            List
          </>
        ) : (
          <>
            <FaMap />
            Map
          </>
        )}
      </div>

      <Formik
        onSubmit={(values, { setSubmitting }) => {
          setQuery(Object.assign(query, values));
          getTripsWithQuery({ q: Object.assign(query, values) })
            .then((res: AxiosResponse) => {
              router.push(
                {
                  pathname: '/trips',
                  query: { q: JSON.stringify(res.config.params.q) },
                },
                undefined,
                { shallow: true }
              );

              setTrips(res.data.trips);
              setTotalPages(res.data.total_pages);
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
        initialValues={{ ...Object.assign(query, q) }}
        component={(p) => <SearchForm {...p} />}
      />

      <div
        className={
          isShowingMap
            ? 'visible trip-map-full-screen animate-fadeIn'
            : 'invisible animate-fadeOut'
        }
        ref={googleMapsRef}
        id="map"
      >
        {map &&
          trips.map((trip, index) => (
            <OverlayContainer
              map={map}
              position={{
                lat: trip?.origin?.lat as number,
                lng: trip?.origin?.lng as number,
              }}
              key={`uniqueKey${index}`}
            >
              <OverlayBubble trip={trip} />
            </OverlayContainer>
          ))}
      </div>

      <div
        id="listTrips"
        className={`${
          isShowingMap ? 'hidden animate-FadeOut' : 'block animate-FadeIn'
        } mx-auto max-w-7xl`}
      >
        <div className="flex justify-center w-full my-4 itmes-center">
          <Pagination
            onPageChange={handlePageChange}
            currentPage={page}
            showIcons={true}
            layout="table"
            totalPages={totalPages}
          />
        </div>

        <ListTrips map={map} isLoading={isLoading} trips={trips} />

        <div className="flex justify-center w-full my-4 itmes-center">
          <Pagination
            onPageChange={handlePageChange}
            currentPage={page}
            showIcons={true}
            layout="navigation"
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(Index);
