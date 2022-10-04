import { Button, Label, Select, Textarea, TextInput } from 'flowbite-react';
import { Field, Form, FormikValues } from 'formik';
import React, { FC, useEffect, useRef, useState } from 'react';
import { FaFlag } from 'react-icons/fa';
import { getDataFromAddressComponents } from '../utils';
import { countryFlag } from '../utils/viewHelpers';

const EditProfileForm: FC<FormikValues> = ({
  setFieldValue,
  isSubmitting,
  errors,
  values,
}) => {
  const locationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'object' && window?.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        locationRef.current as HTMLInputElement,
        {
          types: ['(regions)'],
        }
      );
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        const { city, country, country_code } = getDataFromAddressComponents(
          place.address_components
        );
        setFieldValue('formatted_address', place.formatted_address);
        setFieldValue('city', city);
        setFieldValue('country', country);
        setFieldValue('country_code', country_code);

        if (place.geometry) {
          setFieldValue('lat', place.geometry.location?.lat());
          setFieldValue('lng', place.geometry.location?.lng());
        }
      });
    }
  });

  return (
    <Form>
      <div>
        <Label htmlFor="username">Username</Label>
        <Field name="username">
          {({ field }: FormikValues) => (
            <div className="my-2">
              <TextInput
                id="username"
                name="username"
                placeholder="Enter your username"
                type="text"
                addon="@"
                {...field}
              />
            </div>
          )}
        </Field>
      </div>
      <div>
        <Label htmlFor="formatted_address">
          <span className="flex items-center gap-2">
            Location {countryFlag(values.country_code)}
          </span>
        </Label>
        <Field name="formatted_address">
          {({ field }: FormikValues) => {
            return (
              <div className="my-2">
                <TextInput
                  ref={locationRef}
                  id="formatted_address"
                  name="formatted_address"
                  placeholder="Enter your city or country"
                  icon={FaFlag}
                  type="text"
                  {...field}
                />
              </div>
            );
          }}
        </Field>
      </div>
      <div>
        <Label htmlFor="about_you">About you</Label>
        <Field name="about_you">
          {({ field }: FormikValues) => (
            <div className="my-2">
              <Textarea
                rows={10}
                id="about_you"
                name="about_you"
                placeholder="Tell us about yourself"
                {...field}
              />
            </div>
          )}
        </Field>
      </div>
      <div>
        <Label htmlFor="languages">Languages (comma seperated)</Label>
        <Field name="languages">
          {({ field }: FormikValues) => (
            <div className="my-2">
              <TextInput
                id="languages"
                name="languages"
                placeholder="Enter your languages"
                {...field}
              />
            </div>
          )}
        </Field>
      </div>
      <div className="my-2">
        <Label htmlFor="gender">Gender</Label>
        <Field name="gender">
          {({ field }: FormikValues) => (
            <div className="my-2">
              <Select id="gender" {...field}>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="non-binary">non-binary</option>
              </Select>
            </div>
          )}
        </Field>
      </div>
      <h2 className="my-2 text-xl font-semibold">Social Networks:</h2>
      <div>
        <Label htmlFor="trustroots">Trustroots username</Label>
        <Field name="trustroots">
          {({ field }: FormikValues) => (
            <div className="my-2">
              <TextInput
                name="trustroots"
                placeholder="Your trustroot username"
                {...field}
              />
            </div>
          )}
        </Field>
      </div>
      <div className="my-2">
        <Label htmlFor="cs_user">Couchsurfing username</Label>
        <Field name="cs_user">
          {({ field }: FormikValues) => (
            <div className="my-2">
              <TextInput
                name="cs_user"
                placeholder="Enter your Couchsurfing username"
                type="text"
                {...field}
              />
            </div>
          )}
        </Field>
      </div>
      <div className="my-2">
        <Label htmlFor="be_welcome_user">Be Welcome username</Label>
        <Field name="be_welcome_user">
          {({ field }: FormikValues) => (
            <div className="my-2">
              <TextInput
                name="be_welcome_user"
                placeholder="Enter your Be Welcome username"
                {...field}
              />
            </div>
          )}
        </Field>
      </div>
      <div className="mt-4">
        <Button
          type="submit"
          color={errors ? 'failure' : `info`}
          disabled={isSubmitting}
        >
          Save Profile
        </Button>
      </div>
    </Form>
  );
};

export default EditProfileForm;
