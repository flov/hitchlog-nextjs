import { Alert, Label, TextInput } from 'flowbite-react';
import { Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import Cookies from 'js-cookie';
import Link from 'next/link';
import React, { FC, useState } from 'react';
import { FiKey, FiMail } from 'react-icons/fi';

import { postLogin } from '../db/users';

import { useAuth } from './contexts/AuthContext';
import { useToasts } from './contexts/ToastContext';

type Values = {
  password: string;
  email: string;
};

const Login: FC<{ toggleModal: () => void }> = ({ toggleModal }) => {
  const initialValues = {
    email: '',
    password: '',
  };
  const { setCurrentUser } = useAuth();
  const [error, setError] = useState(null);
  const { addToast } = useToasts();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        postLogin(values)
          .then((res) => {
            setCurrentUser(res.data.user);
            addToast('Welcome back!');
            setError(null);
            Cookies.set('authToken', res.headers.authorization.split(' ')[1]);
            toggleModal();
          })
          .catch((err) => {
            addToast('Something went wrong', 'error');
            setError(err.response.data);
          });

        setSubmitting(false);
      }}
    >
      <Form>
        {error && (
          <div className="mb-2">
            <Alert color="failure">
              <span>
                <span className="font-medium">{error}</span>
              </span>
            </Alert>
          </div>
        )}

        <div className="block mb-2">
          <Label htmlFor="email" value="Your email" />
        </div>

        <Field name="email">
          {({ field }: FormikValues) => (
            <div>
              <TextInput
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                icon={FiMail}
                {...field}
              />
            </div>
          )}
        </Field>
        <label
          className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="password"
        >
          Password
        </label>
        <Field name="password">
          {({ field }: FormikValues) => (
            <TextInput
              id="password"
              name="password"
              placeholder="Enter password"
              type="password"
              icon={FiKey}
              {...field}
            />
          )}
        </Field>

        <div className="my-4">
          <button
            type="submit"
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Sign in
          </button>
        </div>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Don’t have an account yet?{' '}
          <Link
            onClick={toggleModal}
            className="font-medium text-primary-600 dark:text-primary-500"
            href="/register"
          >
            Sign up
          </Link>
        </p>
        <p className="m-0 text-sm font-light text-gray-500 dark:text-gray-400">
          Forgot your password?{' '}
          <Link
            onClick={toggleModal}
            className="mt-0 font-medium text-primary-600 dark:text-primary-500"
            href="/forgot_password"
          >
            Reset password
          </Link>
        </p>
      </Form>
    </Formik>
  );
};

export default Login;
