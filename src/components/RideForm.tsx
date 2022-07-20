import {
  Button,
  Label,
  Select,
  Textarea,
  TextInput
} from 'flowbite-react';
import { FormikValues } from 'formik';

export const RideForm = ({
  handleSubmit, handleChange, handleBlur, values, errors,
}: FormikValues) => {
  console.log(values);
  return (
    <form onSubmit={handleSubmit}>
      <div className="block mb-2">
        <Label htmlFor="title" value="Title" />
      </div>
      <TextInput
        id="title"
        type="text"
        placeholder="Title"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.title}
        name="title" />

      <div id="textarea" className="mt-2">
        <div className="block mb-2">
          <Label htmlFor="story" value="My Story" />
        </div>
        <Textarea
          id="story"
          name="story"
          placeholder="Write something about your hitchhiking encounter..."
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4} />
      </div>

      <div id="select" className="mt-2">
        <div className="block mb-2">
          <Label htmlFor="experience" value="Select your experience" />
        </div>
        <Select
          id="experience"
          defaultValue={'good'}
          required={true}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.experience}
        >
          <option>very good</option>
          <option>good</option>
          <option>neutral</option>
          <option>bad</option>
          <option>very bad</option>
        </Select>
      </div>

      {errors.name && <div>{errors.name}</div>}
      <div className="mt-4">
        <Button type="submit">Save Ride</Button>
      </div>
    </form>
  );
};
