import { GetServerSideProps } from 'next';
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import { Status } from '@googlemaps/react-wrapper';
import OverlayContainer from '../src/components/OverlayContainer';
import OverlayBubble from '../src/components/OverlayBubble';
import Trips from '../src/stubs/trips';
import { getTrips, getTripsByExperience } from '../src/db/trips';
import { Experiences, Trip } from '../src/types';
import { Badge, Button, Dropdown, Label, Select } from 'flowbite-react';
import { ListTrips } from '../src/components/ListTrips';
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

const Foo: FC<{ trips: Trip[]; google: GoogleAPI }> = (props) => {
  const { google } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [trips, setTrips] = useState<Trip[]>(props.trips);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) {
      let createdMap = new google.maps.Map(ref.current, {
        center: { lat: Trips[0].origin.lat, lng: Trips[0].origin.lng },
        zoom: 2,
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

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between py-2 ">
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
}))(Foo);
