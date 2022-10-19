import { Alert, Button, Label, Select, TextInput } from 'flowbite-react';
import { Field, FormikValues } from 'formik';
import moment from 'moment';
import { ChangeEvent, MutableRefObject, useEffect, useRef } from 'react';
import { secondsToHumanReadable } from '../utils';
import { AutocompleteDirectionsHandler } from '../utils/AutocompleteDirectionsHandler';
import { calculateTimeBetweenDates } from '../utils/calculateTimeBetweenDates';
import {
  countryFlag,
  showErrors,
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
        {showTripDistance(values.totalDistance)}
        {showTripDuration(values.departure, values.arrival)}
        {showTripGoogleDuration(values.googleDuration)}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="originName">Starting point</Label>
          <Field name="originName">
            {({ field }: FormikValues) => (
              <div className="">
                <TextInput
                  id="originName"
                  ref={originRef}
                  placeholder="Enter origin"
                  type="text"
                  required
                  color={
                    touched.originName && errors.origin?.lat
                      ? 'failure'
                      : touched.originName
                      ? 'success'
                      : 'gray'
                  }
                  {...field}
                />
              </div>
            )}
          </Field>
        </div>

        <div>
          <Label htmlFor="destinationName">Destination</Label>
          <TextInput
            ref={destinationRef}
            type="text"
            required={true}
            placeholder="Enter destination"
            color={
              touched.destination && errors.destination?.lat
                ? 'failure'
                : touched.destinationName
                ? 'success'
                : 'gray'
            }
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.destinationName}
            name="destinationName"
          />
        </div>
        <div>
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
        <div>
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
        <div>
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

        <div>
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
            <option value="0">yourself</option>
            <option value="1">with one other person</option>
            <option value="2">with two other persons</option>
            <option value="3">with three other persons</option>
          </Select>
        </div>

        <div className="flex justify-center col-span-2">
          <Button disabled={isSubmitting} type="submit">
            Save Trip
          </Button>
        </div>
      </div>
    </form>
  );
};
