import axios from 'axios';
import { Alert, Button, Label, TextInput } from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { API_URL } from '../src/config';
import { showErrors } from '../src/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  console.log(query);

  return {
    props: {
      token: query?.token,
    },
  };
};

const Reset: NextPage<{ token: string }> = ({ token }) => {
  const [errors, setErrors] = useState();
  const router = useRouter();

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md-full-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-2xl">Change your Password</h1>
            <Formik
              onSubmit={(values) => {
                axios
                  .put(`${API_URL}/users/password`, { user: { ...values } })
                  .then((res) => {
                    router.push('/login');
                  })
                  .catch((error) => {
                    setErrors(error?.response?.data);
                  });
              }}
              initialValues={{
                reset_password_token: token,
                password: '',
                password_confirmation: '',
              }}
            >
              {({ handleSubmit }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    {errors && (
                      <Alert color="failure">
                        <span>
                          <span className="font-medium">
                            {showErrors(errors)}
                          </span>
                        </span>
                      </Alert>
                    )}

                    <div className="mt-2">
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        New password
                      </label>
                      <Field name="password">
                        {({ field }: FormikValues) => (
                          <div>
                            <TextInput
                              name="password"
                              placeholder="New password"
                              type="password"
                              required="true"
                              {...field}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="mt-2">
                      <label
                        htmlFor="password_confirmation"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password confirmation
                      </label>
                      <Field name="password_confirmation">
                        {({ field }: FormikValues) => (
                          <div>
                            <TextInput
                              name="password_confirmation"
                              placeholder="Enter confirmation"
                              type="password"
                              required="true"
                              {...field}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button type="submit">Change my password</Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reset;
