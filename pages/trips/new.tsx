import { getAuth } from 'firebase/auth';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NewTripForm } from '../../src/components/NewTripForm';
import { IpLocation } from '../../src/types/IpLocation';
import {
  fetchLocationFromClient,
  fetchIpAddressOfClient,
} from '../../src/utils';
import { db, getLoader } from '../../src/utils/firebase';

export const getServerSideProps: GetServerSideProps = async () => {
  const ipAddress = await fetchIpAddressOfClient();
  const clientLocation = await fetchLocationFromClient();
  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      clientLocation: JSON.parse(JSON.stringify(clientLocation)),
    },
  };
};

const New: NextPage<{ googleMapsKey: string; clientLocation: IpLocation }> = ({
  googleMapsKey,
  clientLocation,
}) => {
  const googlemap = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [user] = useAuthState(getAuth());

  useEffect(() => {
    const loader = getLoader(googleMapsKey);
    loader.load().then(() => {
      if (!clientLocation) return;
      const map = new google.maps.Map(googlemap.current as HTMLDivElement, {
        center: {
          lat: Number(clientLocation.latitude),
          lng: Number(clientLocation.longitude),
        },
        zoom: 6,
      });
      setMap(map);
    });
  }, [clientLocation, googleMapsKey]);

  return (
    <div>
      <Head>
        <title>Hitchlog - Add new trip</title>
        <meta name="description" content="Add a new hitchhiking trip" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-96" ref={googlemap} id="map"></div>
      <div className="p-4">
        {map && user ? <NewTripForm map={map} /> : <></>}
      </div>
    </div>
  );
};

export default New;
