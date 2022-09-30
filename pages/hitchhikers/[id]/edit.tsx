import {
  Alert,
  Button,
  Label,
  Select,
  Textarea,
  TextInput,
} from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import React, { useState } from 'react';
import { getUserByUsername, updateUser } from '../../../src/db/users';
import { User } from '../../../src/types';
import { executeNTimes, randomConfetti } from '../../../src/utils';
import { showErrors } from '../../../src/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params?.id) {
    return {
      notFound: true,
    };
  }
  const user = await getUserByUsername(params.id as string);
  return {
    props: { user: JSON.parse(JSON.stringify(user.data)) },
  };
};

const Edit: NextPage<{ user: User }> = ({ user }) => {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errors, setErrors] = useState(null);

  console.log(errors);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-3xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl">Edit Profile</h2>

            {errors && (
              <Alert color="failure">
                <span>
                  <span className="font-medium">{showErrors(errors)}</span>
                </span>
              </Alert>
            )}
            <Formik
              onSubmit={(values, { setSubmitting }) => {
                updateUser(user.username, values)
                  .then((response) => {
                    executeNTimes(() => randomConfetti(), 3);
                    setErrors(null);
                  })
                  .catch((error) => {
                    setErrors(error?.response?.data);
                  })
                  .finally(() => {
                    setSubmitting(false);
                  });
              }}
              initialValues={{
                username: user.username,
                about_you: user.about_you,
                cs_user: user.cs_user,
                be_welcome_user: user.be_welcome_user,
                trustroots: user.trustroots,
                languages: user.languages,
                gender: user.gender,
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Field name="username">
                        {({ field }: FormikValues) => (
                          <div>
                            <TextInput
                              id="username"
                              name="username"
                              placeholder="Enter your username"
                              type="text"
                              addon="@"
                              {...field}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div>
                      <Label htmlFor="about_you">About you</Label>
                      <Field name="about_you">
                        {({ field }: FormikValues) => (
                          <div>
                            <Textarea
                              rows={10}
                              id="about_you"
                              name="about_you"
                              placeholder="Tell us about yourself"
                              {...field}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div>
                      <Label htmlFor="languages">
                        Languages (comma seperated)
                      </Label>
                      <Field name="languages">
                        {({ field }: FormikValues) => (
                          <div>
                            <TextInput
                              id="languages"
                              name="languages"
                              placeholder="Enter your languages"
                              {...field}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Field as="select" name="gender">
                        {({ field }: FormikValues) => (
                          <Select id="gender" {...field}>
                            <option value="male">male</option>
                            <option value="female">female</option>
                            <option value="non-binary">non-binary</option>
                          </Select>
                        )}
                      </Field>
                    </div>
                    <h2 className="mt-2 text-xl font-semibold">
                      Social Networks:
                    </h2>
                    <div>
                      <Label htmlFor="trustroots">Trustroots username</Label>
                      <Field name="trustroots">
                        {({ field }: FormikValues) => (
                          <div>
                            <TextInput
                              name="trustroots"
                              placeholder="Your trustroot username"
                              {...field}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div>
                      <Label htmlFor="cs_user">Couchsurfing username</Label>
                      <Field name="cs_user">
                        {({ field }: FormikValues) => (
                          <div className="">
                            <TextInput
                              name="cs_user"
                              placeholder="Enter your Couchsurfing username"
                              type="text"
                              {...field}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div>
                      <Label htmlFor="be_welcome_user">
                        Be Welcome username
                      </Label>
                      <Field name="be_welcome_user">
                        {({ field }: FormikValues) => (
                          <div>
                            <TextInput
                              name="be_welcome_user"
                              placeholder="Enter your Be Welcome username"
                              {...field}
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="mt-2">
                      <Button
                        type="submit"
                        color={errors ? 'failure' : `info`}
                        disabled={isSubmitting}
                      >
                        Save Profile
                      </Button>
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

export default Edit;
