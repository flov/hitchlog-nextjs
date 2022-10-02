import { Button, Checkbox, Label, Select } from 'flowbite-react';
import { Field, Form, FormikValues } from 'formik';
import { Experiences } from '../types';

const SearchForm = ({ isSubmitting }: FormikValues) => {
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
                defaultChecked={field.value}
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
};

export default SearchForm;
