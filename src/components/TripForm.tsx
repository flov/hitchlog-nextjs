import { Button, Select, TextInput } from 'flowbite-react';
import { FormikValues } from 'formik';
import moment from 'moment';
import { ChangeEvent, MutableRefObject, useEffect, useRef } from 'react';
import { AutocompleteDirectionsHandler } from '../utils/AutocompleteDirectionsHandler';
import { calculateTimeBetweenDates } from '../utils/calculateTimeBetweenDates';
import { secondsToTime } from '../utils/secondsToTime';

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
      <div className="mt-4 grid grid-cols-2 gap-4">
        <TextInput
          ref={originRef}
          type="text"
          color={
            touched.originName && errors.origin?.lat
              ? 'failure'
              : touched.originName
              ? 'success'
              : 'primary'
          }
          required={true}
          placeholder="Enter origin"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.originName}
          name="originName"
        />
        <TextInput
          ref={destinationRef}
          type="text"
          required={true}
          placeholder="Enter destination"
          color={
            touched.destinationName && errors.destination?.lat
              ? 'failure'
              : touched.destinationName
              ? 'success'
              : 'primary'
          }
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.destinationName}
          name="destinationName"
        />
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
              : 'primary'
          }
          onChange={handleChange}
          onBlur={handleBlurArrivalDeparted}
          value={values.departure}
          name="departure"
        />
        <TextInput
          id="arrival"
          ref={arrivalRef}
          type="datetime-local"
          color={
            touched.arrival && errors.arrival
              ? 'failure'
              : touched.arrival
              ? 'success'
              : 'primary'
          }
          required={true}
          placeholder="arrival"
          onChange={handleChange}
          onBlur={handleBlurArrivalDeparted}
          value={values.arrival}
          name="arrival"
        />
        {(values?.arrival && values?.departure) || values.googleDuration ? (
          <>
            <p className="text-center">
              {values.departure && values.arrival
                ? `Your trip duration: ${calculateTimeBetweenDates(
                    values.departure,
                    values.arrival
                  )}`
                : ''}
            </p>
            <p className="text-center">
              {values.googleDuration
                ? `Google Maps Duration ${secondsToTime(values.googleDuration)}`
                : ''}
            </p>
          </>
        ) : (
          ''
        )}

        <div className="">
          <TextInput
            color={
              touched.number_of_rides && errors.number_of_rides
                ? 'failure'
                : touched.number_of_rides
                ? 'success'
                : 'primary'
            }
            id="number_of_rides"
            type="number"
            required={true}
            placeholder="Number of rides"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.number_of_rides}
            name="number_of_rides"
          />
        </div>
        <Select
          id="travelling_with"
          defaultValue={0}
          required={true}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.travelling_with}
          name="travelling_with"
        >
          <option value="0">Travelling by yourself</option>
          <option value="1">Travelling with one other person</option>
          <option value="2">Travelling with two other persons</option>
          <option value="3">Travelling with three other persons</option>
        </Select>
        <div className="flex justify-center my-4 col-span-2">
          <Button disabled={isSubmitting} type="submit">
            Submit Trip
          </Button>
        </div>
      </div>
    </form>
  );
};
