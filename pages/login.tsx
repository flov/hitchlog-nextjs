import React, { FC } from 'react';
import { LoginBlock } from '../src/flowbite';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';

interface Values {
  password: string;
  email: string;
}

const Login: FC = () => {
  const initialValues = {
    email: '',
    password: '',
  };
  const router = useRouter();

  return (
    <LoginBlock>
      <Formik
        initialValues={initialValues}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          fetch('/api/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          })
            .then((res) => res.json())
            .then((data) => router.push('/trips'));

          setSubmitting(false);
        }}
      >
        <Form className="space-y-4 md:space-y-6">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="email"
          >
            Email
          </label>
          <Field
            id="email"
            name="email"
            placeholder="john@acme.com"
            type="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mt-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="password"
          >
            Password
          </label>
          <Field
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 mt-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="password"
            placeholder="John"
            type="password"
          />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </LoginBlock>
  );
};

export default Login;
