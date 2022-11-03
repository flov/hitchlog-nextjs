import axios from 'axios';
import { Alert, Button, Label, Select, TextInput } from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { object, string } from 'yup';
import { API_URL } from '../src/config';
import { FiMail } from 'react-icons/fi';
import { useToasts } from '../src/components/contexts/ToastContext';
import Head from 'next/head';

const UserSchema = object().shape({
  username: string().required(),
  email: string().required(),
  password: string().required(),
  password_confirmation: string().required(),
});

const Register: FC = () => {
  const [error, setError] = useState();
  const router = useRouter();
  const { addToast } = useToasts();

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Sign up</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex flex-col items-center justify-center px-4 py-6 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h1 className="mb-4 text-xl leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign up
            </h1>
            <Formik
              initialValues={{
                username: '',
                email: '',
                password: '',
                password_confirmation: '',
              }}
              validationSchema={UserSchema}
              onSubmit={(values, { setSubmitting }) => {
                axios
                  .post(`${API_URL}/users`, {
                    user: values,
                  })
                  .then((response) => {
                    window.confetti();
                    addToast(
                      'Welcome to the Hitchlog! Please check your mails and confirm your email.'
                    );
                    router.push('/login');
                  })
                  .catch((error) => {
                    addToast(error?.response?.data?.error, 'error');

                    setError(error?.response?.data?.error);
                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  {error && (
                    <div className="mb-4">
                      <Alert color="failure">
                        <span>
                          <span className="font-medium">{error}</span>
                        </span>
                      </Alert>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <Field name="email">
                      {({ field }: FormikValues) => (
                        <div>
                          <TextInput
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            type="email"
                            icon={FiMail}
                            required="true"
                            {...field}
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                  <div className="mt-2">
                    <div className="block mb-2">
                      <Label htmlFor="username" value="Username" />
                    </div>
                    <Field name="username">
                      {({ field }: FormikValues) => (
                        <TextInput
                          placeholder="Enter Username"
                          required={true}
                          addon="@"
                          {...field}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="date_of_birth"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Date of birth
                    </label>
                    <Field name="date_of_birth">
                      {({ field }: FormikValues) => (
                        <TextInput type="date" required={true} {...field} />
                      )}
                    </Field>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="gender"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Gender
                    </label>

                    <Field name="gender">
                      {({ field }: FormikValues) => (
                        <Select
                          id="gender"
                          name="gender"
                          required={true}
                          {...field}
                        >
                          <option value="male">male</option>
                          <option value="female">female</option>
                          <option value="non-binary">non-binary</option>
                        </Select>
                      )}
                    </Field>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="password_confirmation"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm password
                    </label>
                    <Field
                      type="password"
                      name="password_confirmation"
                      id="password_confirmation"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex justify-center my-4">
                    <Button
                      color={error ? 'failure' : 'info'}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Create account
                    </Button>
                  </div>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="/login"
                    >
                      Login here
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
