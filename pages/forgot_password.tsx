import { Alert, Label, TextInput } from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import React, { FC, useState } from 'react';
import { FiMail } from 'react-icons/fi';

import { useToasts } from '../src/components/contexts/ToastContext';
import { postResetPassword } from '../src/db/users';
import { showErrors } from '../src/utils/viewHelpers';

const ForgotPassword: FC = () => {
  const [errors, setErrors] = useState();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { addToast } = useToasts();

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md-full-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="mb-4 text-2xl">Forgot your Password?</h1>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Enter your email address and we will send you a link to reset your
              password
            </p>

            <Formik
              onSubmit={(values, { setSubmitting }) => {
                postResetPassword(values)
                  .then((res) => {
                    setIsSuccessful(true);
                    window.confetti();
                    addToast('Password has been set', 'success');
                    setErrors(undefined);
                  })
                  .catch((error) => {
                    addToast('Something went wrong', 'error');
                    setErrors(error?.response?.data);
                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
              }}
              initialValues={{ email: '' }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    {(errors || isSuccessful) && (
                      <div className="mb-4">
                        <Alert
                          color={`${isSuccessful ? 'success' : 'failure'}`}
                        >
                          <span className="font-medium">
                            {isSuccessful &&
                              'Success! Please check your email.'}
                            {errors && showErrors(errors)}
                          </span>
                        </Alert>
                      </div>
                    )}

                    <div>
                      <div className="mb-2">
                        <Label htmlFor="email">Your Email</Label>
                      </div>

                      <Field name="email">
                        {({ field }: FormikValues) => (
                          <div>
                            <TextInput
                              name="email"
                              id="email"
                              placeholder="Enter your email"
                              type="email"
                              icon={FiMail}
                              required
                              {...field}
                            />
                          </div>
                        )}
                      </Field>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Send me reset password instructions
                    </button>
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

export default ForgotPassword;
