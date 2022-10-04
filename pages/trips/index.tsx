import { GetServerSideProps } from 'next';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import OverlayContainer from '../../src/components/OverlayContainer';
import OverlayBubble from '../../src/components/OverlayBubble';
import { Trip } from '../../src/types';
import { ListTrips } from '../../src/components/ListTrips';
import { PuffLoader } from 'react-spinners';
import { getTripsWithQuery } from '../../src/db/trips_new';
import LoadingContainer from '../../src/components/LoadingContainer';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import SearchForm from '../../src/components/SearchForm';
import { Button, Pagination } from 'flowbite-react';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const res = await getTripsWithQuery({ q: query.q as Record<string, any> });
  const trips = JSON.parse(JSON.stringify(res.data.trips));
  const q = query.q ? JSON.parse(query.q as string) : {};
  const page = query.page ? JSON.parse(query.page as string) : 1;
  const totalPages = JSON.parse(JSON.stringify(res.data.total_pages));

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      trips,
      q,
      page,
      totalPages,
    },
  };
};

const Index: FC<{
  trips: Trip[];
  google: GoogleAPI;
  q: any;
  page: number;
  totalPages: number;
}> = (props) => {
  const { google } = props;
  let q = props.q;
  if (typeof q === 'string') q = JSON.parse(q);
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState({});
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [trips, setTrips] = useState<Trip[]>(props.trips);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(props.page);
  const [totalPages, setTotalPages] = useState(props.totalPages);
  const router = useRouter();

  const setTripsData = (res: AxiosResponse) => {
    setTrips(res.data.trips);
    setTotalPages(res.data.total_pages);
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
  };

  useEffect(() => {
    setQuery(q);
    if (ref.current) {
      let createdMap = new google.maps.Map(ref.current, {
        center: {
          lat: trips[0]?.origin?.lat as number,
          lng: trips[0]?.origin?.lng as number,
        },
        zoom: 7,
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
          setTripsData(res);
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

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      const res = await getTripsWithQuery({
        q: Object.assign(query),
        page,
      });
      setTripsData(res);
      setIsLoading(false);
    };
    fetchTrips();
  }, [page]);

  return (
    <>
      <div className="h-48 lg:h-96" ref={ref} id="map">
        {trips.map((trip, index) => (
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

      <div className="p-4 mx-auto max-w-7xl">
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

                setTripsData(res);
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

        <div className="flex justify-center w-full mb-4 itmes-center">
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
          <>
            {!!trips.length ? (
              <ListTrips map={map} trips={trips} />
            ) : (
              <h1 className="mt-4 mb-8 text-2xl text-center">No trips found</h1>
            )}
          </>
        )}

        <div className="flex justify-center w-full mb-4 itmes-center">
          <Pagination
            onPageChange={handlePageChange}
            currentPage={page}
            showIcons={true}
            layout="pagination"
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
