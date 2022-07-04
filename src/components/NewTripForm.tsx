import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { AutocompleteDirectionsHandler } from '../utils/AutocompleteDirectionsHandler';

export function NewTripForm({ map }: { map: google.maps.Map }) {
  const [state, setState] = useState<{
    originPlaceId?: string;
    destinationPlaceId?: string;
    start?: string;
    arrival?: string;
  }>({});

  useEffect(() => {
    new AutocompleteDirectionsHandler(map, setState);
  }, [map]);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(state);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setState({ ...state, [name]: value });
  };

  console.log(state);

  return (
    <form onSubmit={submitForm} className="container max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="my-6 form-group">
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
        <div className="my-6 form-group">
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
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-6 form-group">
          <input
            onChange={handleInputChange}
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
        <div className="mb-6 form-group">
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
            id="arrived"
            placeholder="Arrived when?"
          />
        </div>
      </div>
      <button
        type="submit"
        className="
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
