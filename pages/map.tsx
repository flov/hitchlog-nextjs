import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { forkJoin } from 'rxjs';
import { HitchhikingTrip } from '../src/components/HitchhikingTrip';
import { Ride } from '../src/db/trips';
import { getRidesForTrip, getTrips, Trip } from '../src/db/trips';
import { getUser, User } from '../src/db/users';
import { displayRoute } from '../src/utils/DirectionsHandler';
import { getLoader } from '../src/utils/firebase';
import { initPopup } from '../src/utils/Popup';

export const getServerSideProps: GetServerSideProps = async () => {
  const trips = await getTrips();

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      trips: JSON.parse(JSON.stringify(trips)),
    },
  };
};

const Map: NextPage<{
  googleMapsKey: string;
  trips: Trip[];
}> = ({ googleMapsKey, trips }) => {
  const googlemap = useRef<HTMLDivElement>(null);
  const overlayRefs = useRef<HTMLDivElement[]>(new Array());

  const [user, setUser] = useState<User>();
  const [trip, setTrip] = useState<Trip>();
  const [rides, setRides] = useState<Ride[]>();
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  useEffect(() => {
    if (trip) {
      forkJoin([
        getRidesForTrip(trip.id as string),
        getUser(trip?.uid as string),
      ]).subscribe(([rides, user]) => {
        setRides(rides as Ride[]);
        setUser(user as User);
      });
    }
  }, [trip]);

  useEffect(() => {
    const loader = getLoader(googleMapsKey);
    loader.load().then(() => {
      const map = new google.maps.Map(googlemap.current as HTMLDivElement, {
        center: {
          lat: trips[2]?.origin?.lat as number,
          lng: trips[2]?.origin?.lng as number,
        },
        zoom: 3,
      });
      setDirectionsService(new google.maps.DirectionsService());
      setDirectionsRenderer(
        new google.maps.DirectionsRenderer({
          map,
        })
      );

      const Popup = initPopup();
      if (typeof window === 'object') {
        trips.forEach((t, index) => {
          if (t.origin) {
            const popup = new Popup(
              new google.maps.LatLng(t?.origin?.lat, t?.origin?.lng),
              overlayRefs.current[index] as HTMLDivElement
            );
            popup.setMap(map);
          }
        });
      }
    });
  }, [googleMapsKey, trips]);

  const handleClickOnTripBubble = (trip: Trip) => {
    setTrip(trip);
    if (
      trip.origin &&
      trip.destination &&
      directionsService &&
      directionsRenderer
    ) {
      displayRoute(
        trip.origin,
        trip.destination,
        directionsService,
        directionsRenderer
      );
    }
  };

  return (
    <>
      {/* <div className="w-full h-20">
        <div className="flex items-center justify-between">
          <div className="grid ">
            <button>
              <FaCarSide size="52" color="gray" />
              <p>Sort by Car</p>
            </button>
          </div>
        </div>
      </div> */}
      <div className="h-4/6" ref={googlemap} id="map"></div>
      {trips.map((trip, index) => (
        <div
          key={`tripOverlay${trip.id}`}
          ref={(element) =>
            overlayRefs.current.splice(index, 1, element as HTMLDivElement)
          }
        >
          <button onClick={() => handleClickOnTripBubble(trip)}>
            {trip.origin?.city} <BsArrowRight className="inline" />{' '}
            {trip.destination?.city}
          </button>
        </div>
      ))}
      <div className="max-w-4xl py-8 mx-auto">
        {user && trip && rides && (
          <HitchhikingTrip rides={rides} user={user} trip={trip} />
        )}
      </div>
    </>
  );
};

export default Map;
