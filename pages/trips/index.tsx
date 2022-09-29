import { GetServerSideProps } from 'next';
import React, { FC, useEffect, useRef, useState } from 'react';
import { GoogleAPI, GoogleApiWrapper } from 'google-maps-react';
import OverlayContainer from '../../src/components/OverlayContainer';
import OverlayBubble from '../../src/components/OverlayBubble';
import { Experiences, Trip } from '../../src/types';
import { Select } from 'flowbite-react';
import { ListTrips } from '../../src/components/ListTrips';
import { PuffLoader } from 'react-spinners';
import { getTrips, getTripsByLocation } from '../../src/db/trips_new';
import LoadingContainer from '../../src/components/LoadingContainer';

export const getServerSideProps: GetServerSideProps = async () => {
  const trips = await getTrips();

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      trips: JSON.parse(JSON.stringify(trips)),
    },
  };
};

const Index: FC<{ trips: Trip[]; google: GoogleAPI }> = (props) => {
  const { google } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [trips, setTrips] = useState<Trip[]>(props.trips);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log({ trips });

  useEffect(() => {
    if (ref.current) {
      let createdMap = new google.maps.Map(ref.current, {
        center: {
          lat: trips[0]?.origin?.lat as number,
          lng: trips[0]?.origin?.lng as number,
        },
        zoom: 7,
      });
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
        getTripsByLocation(northLat, southLat, westLng, eastLng).then(
          (trips: Trip[]) => {
            setIsLoading(false);
            setTrips(trips);
          }
        );
      });
      setMap(createdMap);
    }
  }, []);

  const handleExperienceChange = async (e: any) => {
    setIsLoading(true);
    // const newTrips = await getTripsByExperience(e.target.value);
    // setTrips(newTrips as Trip[]);
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
          <>
            <ListTrips trips={trips} />
          </>
        )}
      </div>
    </>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(Index);
