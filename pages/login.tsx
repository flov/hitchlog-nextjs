import React, { FC, useState } from 'react';
import { Field, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { useAuth } from '../src/components/contexts/AuthContext';
import Cookies from 'js-cookie';
import { Alert, Label, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { FiKey, FiMail } from 'react-icons/fi';
import { useToasts } from '../src/components/contexts/ToastContext';
import { postLogin } from '../src/db/users';

type Values = {
  password: string;
  email: string;
};

const Login: FC = () => {
  const initialValues = {
    email: '',
    password: '',
  };
  const router = useRouter();
  const { setCurrentUser } = useAuth();
  const [error, setError] = useState(null);

  const { addToast } = useToasts();

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md-full-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>

            <Formik
              initialValues={initialValues}
              onSubmit={(
                values: Values,
                { setSubmitting }: FormikHelpers<Values>
              ) => {
                postLogin(values)
                  .then((res) => {
                    console.log(res);
                    setCurrentUser(res.data.user);
                    setError(null);
                    addToast('You have successfully logged in', {
                      appearance: 'success',
                    });
                    Cookies.set(
                      'authToken',
                      res.headers.authorization.split(' ')[1]
                    );
                    router.push(`/hitchhikers/${res.data.user.username}`);
                  })
                  .catch((err) => {
                    addToast('Something went wrong.', {
                      appearance: 'failure',
                    });

                    setError(err.response.data);
                  });

                setSubmitting(false);
              }}
            >
              <Form>
                {error && (
                  <Alert color="failure">
                    <span>
                      <span className="font-medium">{error}</span>
                    </span>
                  </Alert>
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
                  <Link href="/register">
                    <a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Sign up
                    </a>
                  </Link>
                </p>
                <p className="m-0 text-sm font-light text-gray-500 dark:text-gray-400">
                  Forgot your password?{' '}
                  <Link href="/forgot_password">
                    <a className="mt-0 font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Reset password
                    </a>
                  </Link>
                </p>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
