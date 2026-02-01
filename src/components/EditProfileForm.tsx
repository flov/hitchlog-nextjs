import { Button } from '@/flowbite';
import { Label, Select, TextInput, Textarea } from 'flowbite-react';
import { Field, Form, FormikValues } from 'formik';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FaFlag } from 'react-icons/fa';

import { OpenStreetMapService } from '../utils/OpenStreetMapService';
import { countryFlag } from '../utils/viewHelpers';

const EditProfileForm: FC<FormikValues> = ({
  setFieldValue,
  isSubmitting,
  errors,
  values,
}) => {
  const locationRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchPlaces = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const results = await OpenStreetMapService.searchPlaces(query, 5);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  useEffect(() => {
    const input = locationRef.current;
    if (!input) return;
    const handleInput = (e: Event) => {
      const query = (e.target as HTMLInputElement).value;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => searchPlaces(query), 300);
    };
    input.addEventListener('input', handleInput);
    return () => {
      input.removeEventListener('input', handleInput);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchPlaces]);

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
              <div className="relative my-2">
                <TextInput
                  ref={locationRef}
                  id="formatted_address"
                  name="formatted_address"
                  placeholder="Enter your city or country"
                  icon={FaFlag}
                  type="text"
                  autoComplete="off"
                  {...field}
                  onBlur={(e: React.FocusEvent) => {
                    setTimeout(() => setShowSuggestions(false), 200);
                    field.onBlur?.(e);
                  }}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={suggestion.place_id || index}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          const { city, country, country_code } =
                            OpenStreetMapService.getDataFromAddressComponents(
                              suggestion.address_components || []
                            );
                          setFieldValue('formatted_address', suggestion.formatted_address);
                          setFieldValue('city', city);
                          setFieldValue('country', country);
                          setFieldValue('country_code', country_code);
                          setFieldValue('lat', suggestion.lat);
                          setFieldValue('lng', suggestion.lng);
                          setSuggestions([]);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="font-medium text-sm text-gray-900">
                          {suggestion.formatted_address}
                        </div>
                        {(suggestion.city || suggestion.country) && (
                          <div className="text-xs text-gray-500">
                            {[suggestion.city, suggestion.country].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }}
        </Field>
      </div>
      <div>
        <Label htmlFor="about_you">About you (markdown)</Label>
        <Field name="about_you">
          {({ field }: FormikValues) => (
            <div className="my-2">
              <Textarea
                rows={10}
                value={values.about_you}
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
      <h2 className="my-2 text-xl font-semibold">Social Network:</h2>
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
