import { Button } from '@/flowbite';
import { Checkbox, Label, Select, Spinner } from 'flowbite-react';
import { Field, Form, FormikValues } from 'formik';
import { FaCamera, FaScroll, FaVideo } from 'react-icons/fa';

import { Experiences } from '../../types';
import { countries } from '../../utils/country_codes';

const TripsSearchInterface = ({
  handleChange,
  isSubmitting,
  submitForm,
  map,
  bounds,
}: FormikValues) => {
  const handleCountryChange = (e: any) => {
    const country_code = e.target.value;
    map.panTo({
      /* @ts-ignore */
      lat: countries[country_code].lat,
      /* @ts-ignore */
      lng: countries[country_code].lng,
    });
    handleChange(e);
    submitForm();
  };

  return (
    <Form className="flex justify-around p-2 border dark:border-0 border-y-1 dark:bg-gray-900 sm:flex-row">
      <div className="flex items-center justify-between gap-2">
        <Field name="from_country_code_eq">
          {({ field }: FormikValues) => (
            <Select
              sizing="sm"
              className="w-32"
              id="from_country_code_eq"
              name="from_country_code_eq"
              onChange={handleCountryChange}
            >
              <option value="">Country</option>
              {Object.keys(countries).map((coutry_code) => (
                <option key={coutry_code} value={coutry_code}>
                  {/* @ts-ignore */}
                  {countries[coutry_code].name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field name="rides_experience_eq">
          {({ field }: FormikValues) => (
            <div className="flex items-center gap-2">
              <Select
                className="w-32"
                sizing="sm"
                id="rides_experience_eq"
                name="rides_experience_eq"
                onChange={handleChange}
              >
                <option value="">Experience</option>
                {Experiences.map((experience) => (
                  <option key={experience} value={experience}>
                    {experience}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </Field>

        <Field name="rides_photo_present">
          {({ field }: FormikValues) => {
            return (
              <div className="flex items-center gap-2">
                <Checkbox
                  name="rides_photo_present"
                  id="rides_photo_present"
                  defaultChecked={field.value}
                  {...field}
                />
                <Label htmlFor="rides_photo_present">
                  <FaCamera />
                </Label>
              </div>
            );
          }}
        </Field>
        <Field name="rides_story_present">
          {({ field }: FormikValues) => {
            return (
              <div className="flex items-center gap-2">
                <Checkbox
                  name="rides_story_present"
                  id="rides_story_present"
                  defaultChecked={field.value}
                  {...field}
                />
                <Label htmlFor="rides_story_present">
                  <FaScroll className="inline" />
                </Label>
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
                defaultChecked={field.value}
                {...field}
              />
              <Label htmlFor="rides_youtube_present">
                <FaVideo />
              </Label>
            </div>
          )}
        </Field>
        <Button size="sm" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="mr-2">
              <Spinner light />
            </div>
          ) : (
            <>Search</>
          )}
        </Button>
      </div>
    </Form>
  );
};

export default TripsSearchInterface;
