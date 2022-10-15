import { Button, Checkbox, Label, Select, Spinner } from 'flowbite-react';
import { Field, Form, FormikValues } from 'formik';
import { FaCamera, FaScroll, FaVideo } from 'react-icons/fa';
import { Experiences } from '../types';

const SearchForm = ({
  handleChange,
  submitForm,
  isSubmitting,
  values,
}: FormikValues) => {
  return (
    <Form className="flex justify-around sm:flex-row">
      <div className="flex justify-between mb-2 gap-2">
        <Field name="rides_experience_eq">
          {({ field }: FormikValues) => (
            <div className="">
              <Select
                id="rides_experience_eq"
                name="rides_experience_eq"
                {...field}
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
      </div>

      <div className="mb-4">
        <Button type="submit" disabled={isSubmitting}>
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

export default SearchForm;
