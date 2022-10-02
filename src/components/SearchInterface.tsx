import { AxiosResponse } from 'axios';
import { Button, Checkbox, Label, Select } from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import { useRouter } from 'next/router';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { getTripsWithQuery } from '../db/trips_new';
import { Experiences, Trip } from '../types';

const SearchInterface: FC<{
  setTrips: Dispatch<SetStateAction<Trip[]>>;
  query: Record<string, any>;
  setQuery: Dispatch<SetStateAction<Record<string, any>>>;
}> = ({ setTrips, query, setQuery }) => {
  const router = useRouter();
  console.log({ query });
  return (
    <Formik
      onSubmit={(values, { setSubmitting }) => {
        setQuery(Object.assign(query, values));
        getTripsWithQuery({ q: Object.assign(query, values) })
          .then((res: AxiosResponse) => {
            router.push(
              {
                pathname: '/trips',
                query: { q: JSON.stringify(res.config.params.q) },
              },
              undefined,
              { shallow: true }
            );

            setTrips(res.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
      initialValues={{
        from_lat_gt: 52.22127920425977,
        from_lat_lt: 54.731162011101304,
        from_lng_gt: 22.617676743750046,
        from_lng_lt: 42.305176743750046,
        rides_story_present: true,
      }}
    >
      {({ isSubmitting, values }) => {
        return (
          <Form>
            <div className="flex justify-between pb-4 ">
              <Field name="rides_experience_eq">
                {({ field }: FormikValues) => (
                  <div className="w-48">
                    <Select
                      id="rides_experience_eq"
                      name="rides_experience_eq"
                      {...field}
                    >
                      <option value="">Select Experience</option>
                      {Experiences.map((experience) => (
                        <option key={experience} value={experience}>
                          {experience}
                        </option>
                      ))}
                    </Select>
                  </div>
                )}
              </Field>

              <Field name="rides_story_present">
                {({ field }: FormikValues) => {
                  console.log(field);
                  return (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        name="rides_story_present"
                        id="rides_story_present"
                        defaultChecked={field.value}
                        {...field}
                      />
                      <Label htmlFor="rides_story_present">with story</Label>
                    </div>
                  );
                }}
              </Field>

              <Field name="rides_youtube_present">
                {({ field }: FormikValues) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      name="rides_youtube_present"
                      id="rides_youtube_present"
                      {...field}
                    />
                    <Label htmlFor="rides_youtube_present">with video</Label>
                  </div>
                )}
              </Field>

              <Button type="submit" disabled={isSubmitting}>
                Search
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SearchInterface;
