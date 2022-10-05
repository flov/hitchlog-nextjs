import axios from 'axios';
import { Alert, Button, Label, Select, TextInput } from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { object, string } from 'yup';
import { API_URL } from '../src/config';
import { FiKey, FiMail } from 'react-icons/fi';

const UserSchema = object().shape({
  username: string().required(),
  email: string().required(),
  password: string().required(),
  password_confirmation: string().required(),
});

const Register: FC = () => {
  const [error, setError] = useState();
  const router = useRouter();

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
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
                    router.push('/login');
                  })
                  .catch((error) => {
                    setError(error?.response?.data?.error);
                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  {error && (
                    <div>
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
                  <div>
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
                  <div>
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
                  <div>
                    <label
                      htmlFor="gender"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Gender
                    </label>

                    <Field name="gender">
                      {({ field }: FormikValues) => (
                        <Select id="gender" required={true} {...field}>
                          <option value="male">male</option>
                          <option value="female">female</option>
                          <option value="non-binary">non-binary</option>
                        </Select>
                      )}
                    </Field>
                  </div>
                  <div>
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
                  <div>
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

                  <div className="flex justify-center">
                    <Button
                      color={error ? 'failure' : 'light'}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Create an account
                    </Button>
                  </div>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login">
                      <a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                        Login here
                      </a>
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
