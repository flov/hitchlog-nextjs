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

  console.log({ errors });

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <TextInput
          ref={originRef}
          type="text"
          required={true}
          placeholder="Enter an origin location"
        />
        <TextInput
          ref={destinationRef}
          type="text"
          required={true}
          placeholder="Enter a destination location"
        />
        <TextInput
          id="departure"
          type="datetime-local"
          required={true}
          placeholder="departure"
          onChange={handleChange}
          onBlur={handleBlurArrivalDeparted}
          value={values.departure}
          name="departure"
        />
        <TextInput
          id="arrival"
          ref={arrivalRef}
          type="datetime-local"
          required={true}
          placeholder="arrival"
          onChange={handleChange}
          onBlur={handleBlurArrivalDeparted}
          value={values.arrival}
          name="arrival"
        />
        {(values?.arrival && values?.departure) || values.googleDuration ? (
          <div className="flex justify-around col-span-2">
            <span>
              {values.departure && values.arrival
                ? `Your trip duration: ${calculateTimeBetweenDates(
                    values.departure,
                    values.arrival
                  )}`
                : ''}
            </span>
            <span>
              {values.googleDuration
                ? `Google Maps Duration ${secondsToTime(values.googleDuration)}`
                : ''}
            </span>
          </div>
        ) : (
          ''
        )}

        <div className="">
          <TextInput
            color={'red'}
            id="numberOfRides"
            type="number"
            required={true}
            placeholder="Number of rides"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.numberOfRides}
            helperText={<>{errors.numberOfRides}</>}
            name="numberOfRides"
          />
        </div>
        <Select
          id="travellingWith"
          defaultValue={0}
          required={true}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.travellingWith}
          name="travellingWith"
        >
          <option value="0">Travelling by yourself</option>
          <option value="1">Travelling in twosome</option>
          <option value="2">Travelling in threesome</option>
          <option value="3">Travelling in foursome</option>
        </Select>
      </div>

      <div className="mt-4">
        <Button type="submit">Submit Trip</Button>
      </div>
    </form>
  );
};
