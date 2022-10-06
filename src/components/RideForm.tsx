import { Button, Label, Textarea, TextInput } from 'flowbite-react';
import { Field, Form, FormikValues } from 'formik';
import { ChangeEvent } from 'react';
import { Experiences, Vehicles } from '../types';

export const RideForm = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
}: FormikValues) => {
  const handleOnChange = (e: ChangeEvent) => {
    handleChange(e);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-2">
        <Label htmlFor="title" value="Title" />
      </div>
      <TextInput
        type="text"
        placeholder="Title"
        onChange={handleOnChange}
        onBlur={handleBlur}
        value={values.title}
        name="title"
      />
      <div className="mt-2">
        <div className="mb-2">
          <Label htmlFor="story" value="My Story" />
        </div>
        <Textarea
          name="story"
          placeholder="Write something about your hitchhiking encounter..."
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
        />
      </div>

      <div className="mt-2">
        <div className="mb-2">
          <Label htmlFor="experience" value="Select your experience" />
        </div>
        <Field
          as="select"
          name="experience"
          className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
        >
          <option value="">Select experience</option>
          {Experiences.map((experience) => (
            <option key={experience}>{experience}</option>
          ))}
        </Field>
      </div>

      <div className="mt-2">
        <div className="mb-2">
          <Label htmlFor="vehicle" value="Select your vehicle" />
        </div>
        <Field
          as="select"
          name="vehicle"
          className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm"
        >
          <option>Select vehicle</option>
          {Vehicles.map((vehicle) => (
            <option key={vehicle}>{vehicle}</option>
          ))}
        </Field>

        <div className="my-2">
          <Label htmlFor="waiting_time" value="Waiting Time in minutes" />
        </div>
        <TextInput
          type="text"
          placeholder="Waiting Time"
          onChange={handleOnChange}
          onBlur={handleBlur}
          value={values.waiting_time}
          name="waiting_time"
        />
      </div>

      {errors.name && <div>{errors.name}</div>}
      <div className="mt-4">
        <Button type="submit">Save Ride</Button>
      </div>
    </Form>
  );
};
