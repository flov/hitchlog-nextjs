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
import TripsSearchInterface from '../../src/components/Trips/SearchInterface';
import { Button, Pagination } from 'flowbite-react';
import { FaList, FaMap } from 'react-icons/fa';
import Head from 'next/head';
import { useToasts } from '../../src/components/contexts/ToastContext';
import { countries } from '../../src/utils/country_codes';

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
  const [query, setQuery] = useState({});
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(props.page);
  const [totalPages, setTotalPages] = useState(1);

  const googleMapsRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { addToast } = useToasts();

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
    fetchTrips();
  };

  const [bounds, setBounds] = useState<google.maps.LatLngBounds>();

  useEffect(() => {
    fetchTrips();
    setQuery(q);

    if (googleMapsRef.current) {
      let lat: number, lng: number;
      // if country was selected in filter, pan to that country
      if (q.from_country_code_eq) {
        // @ts-ignore
        lat = countries[q.from_country_code_eq].lat;
        // @ts-ignore
        lng = countries[q.from_country_code_eq].lng;
      } else {
        // center of europe
        lat = 50.85045;
        lng = 4.34878;
      }

      let createdMap = new google.maps.Map(googleMapsRef.current, {
        center: { lat, lng },
        zoom: 6,
        gestureHandling: 'greedy',
      });
      setMap(createdMap);

      google.maps.event.addListener(createdMap, 'dragend', function () {
        setBounds(createdMap.getBounds());
      });
    }
  }, []);

  const [isShowingMap, setIsShowingMap] = useState(false);
  console.log({ bounds });

  const searchMapWithinBounds = async () => {
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const res = await getTripsWithQuery({
        q: {
          from_lat_lt: ne.lat(),
          from_lat_gt: sw.lat(),
          from_lng_lt: ne.lng(),
          from_lng_gt: sw.lng(),
        },
        page: 1,
      });
      setTrips(res.data.trips);
      setTotalPages(res.data.total_pages);
      setIsLoading(false);
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
    }
  };

  return (
    <>
      <Head>
        <title>Hitchlog - Hitchhiking Trips</title>
      </Head>

      <div
        className="fixed z-10 flex items-center justify-center p-2 cursor-pointer sm:hidden gap-2 left-1/2 fixed-button"
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
              addToast(err.message, 'error');
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
        initialValues={{ ...Object.assign(query, q) }}
        component={(p) => (
          <TripsSearchInterface {...p} map={map} bounds={bounds} />
        )}
      />

      <div
        className={`relative md:visible ${
          isShowingMap ? 'visible' : 'invisible'
        }`}
      >
        {!!bounds && (
          <Button
            color="light"
            className="absolute z-10 flex items-center justify-center p-2 text-gray-800 bg-white rounded-full cursor-pointer translate--50p animate-fadeIn top-5 gap-2 left-1/2"
            onClick={() => searchMapWithinBounds()}
            size="sm"
          >
            Search this Area
          </Button>
        )}

        <div
          className={
            isShowingMap
              ? 'visible trip-map-full-screen animate-fadeIn'
              : 'invisible animate-fadeOut sm:visible md:h-74'
          }
          ref={googleMapsRef}
          id="map"
        >
          {map && (
            <>
              {trips.map((trip, index) => (
                <OverlayContainer
                  map={map}
                  position={{
                    lat: Number(trip?.center.split(',')[0]),
                    lng: Number(trip?.center.split(',')[1]),
                  }}
                  key={`uniqueKey${index}`}
                >
                  <OverlayBubble trip={trip} map={map} />
                </OverlayContainer>
              ))}
            </>
          )}
        </div>
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
