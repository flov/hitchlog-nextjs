import { Button, Label, Textarea, TextInput } from 'flowbite-react';
import { Field, Form, FormikValues } from 'formik';

export const SendMessageForm = ({ isSubmitting }: FormikValues) => {
  return (
    <Form>
      <div className="flex flex-col">
        <div>
          <Label htmlFor="message">message</Label>
          <Field name="message">
            {({ field }: FormikValues) => (
              <div className="my-2">
                <Textarea
                  rows={10}
                  id="message"
                  name="message"
                  placeholder="Enter message"
                  type="text"
                  required
                  {...field}
                />
              </div>
            )}
          </Field>
        </div>

        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </Form>
  );
};

export default SendMessageForm;
