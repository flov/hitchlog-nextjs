import { GetServerSideProps } from 'next';
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import { Status } from '@googlemaps/react-wrapper';
import OverlayContainer from '../../src/components/OverlayContainer';
import OverlayBubble from '../../src/components/OverlayBubble';
import {
  getTrips,
  getTripsByExperience,
  getTripsByLocation,
} from '../../src/db/trips';
import { Experiences, Trip } from '../../src/types';
import { Select } from 'flowbite-react';
import { ListTrips } from '../../src/components/ListTrips';
import { PuffLoader } from 'react-spinners';

export const getServerSideProps: GetServerSideProps = async () => {
  const trips = await getTrips();

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      trips: JSON.parse(JSON.stringify(trips)),
    },
  };
};

const LoadingContainer = (status: Status): ReactElement => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return <></>;
};

const Index: FC<{ trips: Trip[]; google: GoogleAPI }> = (props) => {
  const { google } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [trips, setTrips] = useState<Trip[]>(props.trips);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) {
      let createdMap = new google.maps.Map(ref.current, {
        center: {
          lat: trips[0]?.origin?.lat as number,
          lng: trips[0]?.origin?.lng as number,
        },
        zoom: 5,
      });
      google.maps.event.addListener(createdMap, 'bounds_changed', function () {
        var bounds = createdMap.getBounds();
        var ne = bounds?.getNorthEast();
        var sw = bounds?.getSouthWest();
        //do whatever you want with those bounds

        if (!ne || !sw) return;
        setIsLoading(true);
        getTripsByLocation(ne.lat(), sw.lat()).then((trips: Trip[]) => {
          setIsLoading(false);
          setTrips(trips);
        });
      });
      setMap(createdMap);
    }
  }, []);

  const handleExperienceChange = async (e: any) => {
    setIsLoading(true);
    const newTrips = await getTripsByExperience(e.target.value);
    setTrips(newTrips as Trip[]);
    setIsLoading(false);
  };

  return (
    <>
      <div className="h-96" ref={ref} id="map">
        {trips.map((trip, index) => (
          <OverlayContainer
            map={map}
            position={{
              lat: trip?.origin?.lat as number,
              lng: trip?.origin?.lng as number,
            }}
            key={index}
          >
            <OverlayBubble trip={trip} />
          </OverlayContainer>
        ))}
      </div>

      <div className="p-4 mx-auto max-w-7xl">
        <div className="flex justify-between pb-4 ">
          <div className="w-48">
            <Select
              id="countries"
              onChange={handleExperienceChange}
              required={true}
            >
              <option>Select Experience</option>
              {Experiences.map((experience) => (
                <option key={experience} value={experience}>
                  {experience}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 grid place-items-center">
            <PuffLoader color="blue" />
          </div>
        ) : (
          <ListTrips trips={trips} />
        )}
      </div>
    </>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(Index);
