import { Button, Label, Textarea, TextInput } from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { useToasts } from '../src/components/contexts/ToastContext';
import { postContactForm } from '../src/db/users';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const Contact: NextPage = () => {
  const { addToast } = useToasts();

  return (
    <div className="p-4 sm:pt-8">
      <div className="w-full p-4 bg-white border rounded-lg sm:p-6 sm:mx-auto sm:max-w-lg dark:bg-gray-800 dark:border-gray-700">
        <h4 className="mb-4">Contact us</h4>
        <p className="mb-4">
          We love to hear your feedback, so please feel free to contact us.
        </p>
        <p>
          If you find any bugs please{' '}
          <a
            className="underline"
            href="https://github.com/flov/hitchlog-nextjs/issues"
          >
            file an issue in Github
          </a>
          .
        </p>
        <p className="mb-4">
          If you have any suggestions, let us discuss it under{' '}
          <a
            className="underline"
            href="https://github.com/flov/hitchlog-nextjs/discussions/1"
          >
            discussions on Github
          </a>
          .
        </p>
        <Formik
          onSubmit={(values, { resetForm, setSubmitting }) => {
            postContactForm(values)
              .then(() => {
                addToast('Thank you! Your message has been sent');
              })
              .catch(() => {
                addToast(
                  'Something went wrong, please try again later',
                  'error'
                );
              })
              .finally(() => {
                resetForm();
                setSubmitting(false);
              });
          }}
          initialValues={{ name: '', email: '', message: '' }}
        >
          {({ isSubmitting }) => {
            return (
              <Form>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Field name="name">
                    {({ field }: FormikValues) => (
                      <div className="my-2">
                        <TextInput
                          id="name"
                          name="name"
                          placeholder="Name"
                          type="text"
                          required
                          {...field}
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <div>
                  <Label htmlFor="email">email</Label>
                  <Field name="email">
                    {({ field }: FormikValues) => (
                      <div className="my-2">
                        <TextInput
                          id="email"
                          name="email"
                          placeholder="Email"
                          type="text"
                          required
                          {...field}
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Field name="message">
                    {({ field }: FormikValues) => (
                      <div className="my-2">
                        <Textarea
                          id="message"
                          name="message"
                          rows={8}
                          placeholder="Message"
                          type="text"
                          required
                          {...field}
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <div className="mt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    Send message
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Contact;
