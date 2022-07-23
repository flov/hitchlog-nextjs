import { Badge, Dropdown } from 'flowbite-react';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import { forkJoin } from 'rxjs';
import { HitchhikingTrip } from '../src/components/HitchhikingTrip';
import {
  getRidesForTrip,
  getTrips,
  getTripsByExperience,
} from '../src/db/trips';
import { getUser } from '../src/db/users';
import { Ride } from '../src/types/Ride';
import { Trip } from '../src/types/Trip';
import { User } from '../src/types/User';
import { displayRoute } from '../src/utils/DirectionsHandler';
import { getLoader } from '../src/utils/firebase';
import { initPopup } from '../src/utils/Popup';

export const getServerSideProps: GetServerSideProps = async () => {
  const trips = await getTrips();

  return {
    props: {
      googleMapsKey: process.env.GOOGLE_MAPS_KEY,
      propTrips: JSON.parse(JSON.stringify(trips)),
    },
  };
};

const Map: NextPage<{
  googleMapsKey: string;
  propTrips: Trip[];
}> = ({ googleMapsKey, propTrips }) => {
  const googlemap = useRef<HTMLDivElement>(null);
  const overlayRefs = useRef<HTMLDivElement[]>(new Array());

  const [trips, setTrips] = useState<Trip[]>(propTrips);
  const [user, setUser] = useState<User>();
  const [trip, setTrip] = useState<Trip>();
  const [rides, setRides] = useState<Ride[]>();
  const [popups, setPopups] = useState<any[]>([]);
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
        console.log({ rides, user });
        setRides(rides as Ride[]);
        setUser(user as User);
      });
    }
  }, [trip]);

  useEffect(() => {
    const loader = getLoader(googleMapsKey);
    loader.load().then(() => {
      const Popup = initPopup();
      let tempPopups: any[] = [];
      const map = new google.maps.Map(googlemap.current as HTMLDivElement, {
        center: {
          lat: trips[0]?.origin?.lat as number,
          lng: trips[0]?.origin?.lng as number,
        },
        zoom: 3,
      });
      setDirectionsService(new google.maps.DirectionsService());
      setDirectionsRenderer(
        new google.maps.DirectionsRenderer({
          map,
        })
      );

      if (typeof window === 'object') {
        for (let i = 0; i < trips.length; i++) {
          if (trips[i].origin?.lat && trips[i].origin?.lng) {
            const popup = new Popup(
              new google.maps.LatLng(
                trips[i]?.origin?.lat as number,
                trips[i]?.origin?.lng
              ),
              overlayRefs.current[i] as HTMLDivElement
            );
            tempPopups.push(popup);
            popup.setMap(map);
          }
        }
        setPopups(tempPopups);
      }
    });
  }, []);

  const handleClickOnTripBubble = (trip: Trip) => {
    setTrip(trip);
    // find element by id
    const element = document.getElementById('map');
    if (element) {
      // change height of map
      element.style.height = 'calc(100vh - 70%)';
    }
    setTimeout(() => {
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
    }, 1000);
  };

  const handleExperienceClick = async (experience: string) => {
    const trips = await getTripsByExperience(experience);
    setTrips(trips);
  };

  return (
    <div className="max-h-screen">
      <div className="w-full">
        <div id="#filter" className="z-10 flex items-center justify-center">
          <Dropdown label="Experience">
            <Dropdown.Item onClick={() => handleExperienceClick('very good')}>
              <Badge color="success" size="sm">
                very good
              </Badge>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleExperienceClick('good')}>
              <Badge color="success" size="sm">
                good
              </Badge>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleExperienceClick('neutral')}>
              <Badge color="warning" size="sm">
                neutral
              </Badge>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleExperienceClick('bad')}>
              <Badge color="failure" size="sm">
                bad
              </Badge>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleExperienceClick('very bad')}>
              <Badge color="failure" size="sm">
                very bad
              </Badge>
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      <div className="h-96" ref={googlemap} id="map"></div>
      {trips.map((trip, index) => (
        <div
          key={`tripOverlay${trip.id}`}
          className="popup-bubble"
          ref={(element) =>
            overlayRefs.current.splice(index, 1, element as HTMLDivElement)
          }
        >
          {trip.origin && trip.destination ? (
            <button onClick={() => handleClickOnTripBubble(trip)}>
              {trip.origin.city} <BsArrowRight className="inline" />{' '}
              {trip.destination.city}
            </button>
          ) : (
            <></>
          )}
        </div>
      ))}
      <div className="max-w-4xl py-8 mx-auto">
        {user && trip && rides && (
          <HitchhikingTrip rides={rides} user={user} trip={trip} />
        )}
      </div>
    </div>
  );
};

export default Map;
