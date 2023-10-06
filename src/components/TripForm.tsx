import { Button, Label, Select, TextInput } from 'flowbite-react';
import { Field, FormikValues } from 'formik';
import moment from 'moment';
import { ChangeEvent, MutableRefObject, useEffect, useRef } from 'react';

import { AutocompleteDirectionsHandler } from '../utils/AutocompleteDirectionsHandler';
import {
  countryFlag,
  showTripDistance,
  showTripDuration,
  showTripGoogleDuration,
} from '../utils/viewHelpers';

export const TripForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  setFieldValue,
  errors,
  touched,
  map,
  isSubmitting,
}: FormikValues) => {
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'object' && window?.google) {
      new AutocompleteDirectionsHandler(
        originRef,
        destinationRef,
        map,
        setFieldValue
      );
    }
  }, [map, originRef, setFieldValue]);

  const arrivalRef =
    useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;

  const handleBlurArrivalDeparted = (e: ChangeEvent<HTMLInputElement>) => {
    if (values.arrival && !values.departure) {
      setFieldValue(
        'departure',
        moment(values.arrival).add(-5, 'hours').format('YYYY-MM-DDTHH:MM')
      );
    } else if (!values.arrival && values.departure) {
      setFieldValue(
        'arrival',
        moment(values.departure).add(5, 'hours').format('YYYY-MM-DDTHH:MM')
      );
    }
    handleBlur(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center gap-2">
        {values.country_distances &&
          values.country_distances.map((cd: Record<string, any>) => (
            <div key={cd.distance}>
              {countryFlag(
                cd.country_code,
                `${cd.country}, distance ${Math.round(cd.distance / 1000)} km`
              )}
            </div>
          ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        {showTripDistance(values.distance)}
        {showTripDuration(values.departure, values.arrival)}
        {showTripGoogleDuration(values.google_duration)}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="from_name">Starting point</Label>
          <Field name="from_name">
            {({ field }: FormikValues) => (
              <div className="">
                <TextInput
                  id="from_name"
                  ref={originRef}
                  placeholder="Enter origin"
                  type="text"
                  autoFocus
                  required
                  color={
                    touched.from_name && errors.origin?.lat
                      ? 'failure'
                      : touched.from_name
                      ? 'success'
                      : 'gray'
                  }
                  {...field}
                />
              </div>
            )}
          </Field>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="to_name">Destination</Label>
          <TextInput
            ref={destinationRef}
            type="text"
            required={true}
            placeholder="Enter destination"
            color={
              touched.destination && errors.destination?.lat
                ? 'failure'
                : touched.to_name
                ? 'success'
                : 'gray'
            }
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.to_name}
            name="to_name"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="departure">Departure</Label>
          <TextInput
            id="departure"
            type="datetime-local"
            required={true}
            placeholder="departure"
            color={
              touched.departure && errors.departure
                ? 'failure'
                : touched.departure
                ? 'success'
                : 'gray'
            }
            onChange={handleChange}
            onBlur={handleBlurArrivalDeparted}
            value={values.departure}
            name="departure"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="arrival">Arrival</Label>
          <TextInput
            id="arrival"
            ref={arrivalRef}
            type="datetime-local"
            color={
              touched.arrival && errors.arrival
                ? 'failure'
                : touched.arrival
                ? 'success'
                : 'gray'
            }
            required={true}
            placeholder="arrival"
            onChange={handleChange}
            onBlur={handleBlurArrivalDeparted}
            value={values.arrival}
            name="arrival"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="number_of_rides">Number of rides</Label>
          <Select
            color={
              touched.number_of_rides && errors.number_of_rides
                ? 'failure'
                : touched.number_of_rides
                ? 'success'
                : 'gray'
            }
            id="number_of_rides"
            required={true}
            placeholder="Number of rides"
            onChange={handleChange}
            onBlur={handleBlur}
            defaultValue={1}
            name="number_of_rides"
          >
            {new Array(30).fill(0).map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Select>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <Label htmlFor="travelling_with">Travelling with:</Label>
          <Select
            id="travelling_with"
            color={
              touched.number_of_rides && errors.number_of_rides
                ? 'failure'
                : touched.number_of_rides
                ? 'success'
                : 'gray'
            }
            defaultValue={0}
            required={true}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.travelling_with}
            name="travelling_with"
          >
            <option value="0">alone</option>
            <option value="1">one other person</option>
            <option value="2">two other persons</option>
            <option value="3">three other persons</option>
          </Select>
        </div>

        <div className="flex justify-center mt-2 col-span-2">
          <Button className="w-full" disabled={isSubmitting} type="submit">
            Save Trip
          </Button>
        </div>
      </div>
    </form>
  );
};
