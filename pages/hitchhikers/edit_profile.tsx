import React, { useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import { Alert, Button } from 'flowbite-react';
import { Formik, FormikValues } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import { GoogleApiWrapper } from 'google-maps-react';
import { useRouter } from 'next/router';

import EditProfileForm from '@/components/EditProfileForm';
import LoadingContainer from '@/components/LoadingContainer';
import { profilePicture, showErrors } from '@/utils/viewHelpers';
import { updateUser } from '@/db/users';
import { useAuth } from '@/components/contexts/AuthContext';
import { useToasts } from '@/components/contexts/ToastContext';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    return {
      props: { googleMapsKey: process.env.GOOGLE_MAPS_KEY },
    };
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

const EditProfile: NextPage = () => {
  const [errors, setErrors] = useState(null);
  const { currentUser, setCurrentUser } = useAuth();
  const router = useRouter();
  const { addToast } = useToasts();

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Hitchlog - edit profile</title>
      </Head>

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-3xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          {currentUser && (
            <div className="p-6 sm:p-8">
              <div className="flex justify-between mb-2">
                <h2 className="text-3xl">Edit Profile</h2>
                <Button
                  onClick={() =>
                    router.push(`/hitchhikers/${currentUser.username}`)
                  }
                >
                  Back to profile
                </Button>
              </div>

              <div className="flex items-center">
                <div className="mr-5 image-resize-edit-profile">
                  <Image
                    className="rounded-full shadow shadow-lg w-80"
                    alt="Profile picture"
                    width={128}
                    height={128}
                    src={profilePicture(currentUser.md5_email, 164)}
                  />
                </div>
                <p>
                  This is your gravatar image. Facebook and Google login is in
                  development. Until then, in order to change your profile
                  image, you can change your profile image with your email at{' '}
                  <a className="text-blue-500" href="https://en.gravatar.com/">
                    Gravatar.com
                  </a>
                </p>
              </div>

              {errors && (
                <div className="my-2">
                  <Alert color="failure">
                    <span>
                      <span className="font-medium">{showErrors(errors)}</span>
                    </span>
                  </Alert>
                </div>
              )}
              <Formik
                onSubmit={(values, { setSubmitting }) => {
                  updateUser(currentUser?.username as string, values)
                    .then((response) => {
                      setCurrentUser(response.data);
                      addToast('Profile updated successfully');
                      window.confetti();
                      setErrors(null);
                      values.username !== currentUser.username
                        ? window.location.reload()
                        : router.push(`/hitchhikers/${currentUser.username}`);
                    })
                    .catch((error) => {
                      setErrors(error?.response?.data);
                    })
                    .finally(() => {
                      setSubmitting(false);
                    });
                }}
                initialValues={{
                  username: currentUser.username,
                  about_you: currentUser.about_you,
                  formatted_address: currentUser.location?.formatted_address,
                  lat: currentUser.location?.lat,
                  lng: currentUser.location?.lng,
                  city: currentUser.location?.city,
                  country: currentUser.location?.country,
                  country_code: currentUser.location?.country_code,
                  cs_user: currentUser.cs_user,
                  be_welcome_user: currentUser.be_welcome_user,
                  trustroots: currentUser.trustroots,
                  languages: currentUser.languages,
                  gender: currentUser.gender,
                }}
                component={(props: FormikValues) => {
                  return <EditProfileForm {...props} errors={errors} />;
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GoogleApiWrapper(({ googleMapsKey }) => ({
  apiKey: googleMapsKey,
  LoadingContainer: LoadingContainer,
}))(EditProfile);
