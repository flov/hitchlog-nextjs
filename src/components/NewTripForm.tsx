import {
  addDoc,
  collection,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { AutocompleteDirectionsHandler } from '../utils/AutocompleteDirectionsHandler';
import { createTrip } from '../db/trips';
import { secondsToTime } from '../utils/secondsToTime';

export function NewTripForm({ map }: { map: google.maps.Map }) {
  const [state, setState] = useState<{
    originPlaceId?: string;
    destinationPlaceId?: string;
    start?: string;
    arrival?: string;
    googleDuration?: number;
    totalDistance?: number;
  }>({});

  useEffect(() => {
    new AutocompleteDirectionsHandler(map, setState);
  }, [map]);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    createTrip({ ...state, createdAt: serverTimestamp() });

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
        <div className="flex justify-between col-span-2">
          <span>Your duration: </span>
          <span>
            {state.googleDuration ? `Google Maps Duration ${secondsToTime(state.googleDuration)}` : ''}
          </span>
        </div>
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
            <option selected value="1">
              Travelling Alone
            </option>
            <option value="2">Travelling in twosome</option>
            <option value="3">Travelling in thressome</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="
        mt-4
        w-full
        px-6
        py-2.5
        bg-blue-600
        text-white
        font-medium
        text-xs
        leading-tight
        uppercase
        rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
      >
        Add Trip
      </button>
    </form>
  );
}
