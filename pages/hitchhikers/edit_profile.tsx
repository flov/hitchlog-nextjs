import { Alert, Button } from 'flowbite-react';
import { Formik, FormikValues } from 'formik';
import { GoogleApiWrapper } from 'google-maps-react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuth } from '../../src/components/contexts/AuthContext';
import EditProfileForm from '../../src/components/EditProfileForm';
import LoadingContainer from '../../src/components/LoadingContainer';
import { authenticateToken, updateUser } from '../../src/db/users';
import { executeNTimes, randomConfetti } from '../../src/utils';
import { showErrors } from '../../src/utils/viewHelpers';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    await authenticateToken(req.cookies.authToken);
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
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errors, setErrors] = useState(null);
  const { currentUser, setCurrentUser } = useAuth();
  const router = useRouter();

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
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

              {errors && (
                <div className="my-2">
                  <Alert color="failure">
                    <span>
                      <span className="font-medium">{showErrors(errors)}</span>
                    </span>
                  </Alert>
                </div>
              )}
              {isSuccessful && (
                <div className="my-2">
                  <Alert color="success">
                    <span>
                      <span className="font-medium">
                        Profile updated successfully!
                      </span>
                    </span>
                  </Alert>
                </div>
              )}
              <Formik
                onSubmit={(values, { setSubmitting }) => {
                  setIsSuccessful(false);
                  updateUser(currentUser?.username as string, values)
                    .then((response) => {
                      setCurrentUser(response.data);
                      executeNTimes(() => randomConfetti(), 3);
                      setIsSuccessful(true);
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
                  username: currentUser.username,
                  about_you: currentUser.about_you,
                  formatted_address: currentUser.location.formatted_address,
                  lat: currentUser.location.lat,
                  lng: currentUser.location.lng,
                  city: currentUser.location.city,
                  country: currentUser.location.country,
                  country_code: currentUser.location.country_code,
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
