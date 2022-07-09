import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { AutocompleteDirectionsHandler } from '../utils/AutocompleteDirectionsHandler';
import { createTrip, Trip } from '../db/trips';
import { secondsToTime } from '../utils/secondsToTime';
import { calculateTimeBetweenDates } from '../utils/calculateTimeBetweenDates';
import { Button } from 'flowbite-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';

export function NewTripForm({ map }: { map: google.maps.Map }) {
  const [state, setState] = useState<Trip|{}>({});
  const [user] = useAuthState(auth);

  useEffect(() => {
    new AutocompleteDirectionsHandler(map, setState);
  }, [map]);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    createTrip({ ...state, uid: user?.uid, createdAt: serverTimestamp() });

    e.preventDefault();
  };

  const handleBlurStart = (e: ChangeEvent<HTMLInputElement>) => {
    const arrival = document.getElementById('arrival');
    if (!arrival?.getAttribute('value')) {
      arrival?.setAttribute('value', e.target.value);
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e);
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, name } = e.target;
    setState({ ...state, [name]: value });
  };

  console.log(state);

  return (
    <form onSubmit={submitForm}>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="form-group">
          <input
            type="text"
            id="origin-input"
            name="origin"
            className="form-control
                  block
                  w-full
                  px-3
                  py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            aria-describedby="origin"
            placeholder="Enter an origin location"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="destination"
            className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="destination-input"
            aria-describedby="Enter destination"
            placeholder="Enter destination"
          />
        </div>
        <div className="form-group">
          <input
            onChange={handleInputChange}
            onBlur={handleBlurStart}
            name="start"
            type="datetime-local"
            className="form-control block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="started"
            placeholder="Started when?"
          />
        </div>

        <div className="form-group">
          <input
            type="datetime-local"
            onChange={handleInputChange}
            name="arrival"
            className="form-control block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="arrival"
            placeholder="Arrived when?"
          />
        </div>
        {(state.arrival && state.start) || state.googleDuration ? (
          <div className="flex justify-between col-span-2">
            <span>
              {state.start && state.arrival
                ? `Your trip duration: ${calculateTimeBetweenDates(
                    state.start,
                    state.arrival
                  )}`
                : ''}
            </span>
            <span>
              {state.googleDuration
                ? `Google Maps Duration ${secondsToTime(state.googleDuration)}`
                : ''}
            </span>
          </div>
        ) : (
          ''
        )}
        <div className="">
          <input
            type="number"
            onChange={handleInputChange}
            name="rides"
            className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
            id="numberOfRides"
            placeholder="Number of Rides"
          />
        </div>

        <div className="">
          <select
            onChange={handleInputChange}
            name="amountOfTravellers"
            className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            aria-label="Default select example"
          >
            <option defaultValue={1} value="1">
              Travelling Alone
            </option>
            <option value="2">Travelling in twosome</option>
            <option value="3">Travelling in thressome</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
