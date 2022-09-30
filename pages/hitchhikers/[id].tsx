import { Avatar, Button } from 'flowbite-react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { useAuth } from '../../src/components/contexts/AuthContext';
import { getUserByUsername } from '../../src/db/users';
import { User } from '../../src/types';
import { capitalize, profilePicture } from '../../src/utils';
import {
  countryFlag,
  showCountryFlagForUser,
} from '../../src/utils/viewHelpers';

const divStyle = {};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const user = await getUserByUsername(params?.id as string);

  if (user.data?.error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user.data)),
    },
  };
};

const Show: NextPage<{
  user: User;
}> = ({ user }) => {
  const { currentUser } = useAuth();
  const router = useRouter();

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            {user && (
              <>
                <div className="flex justify-center w-full px-4 lg:w-3/12 lg:order-3">
                  <div className="relative">
                    <img
                      alt="Profile picture"
                      src={profilePicture(user, 150)}
                      className="absolute h-auto -ml-20 align-middle border-none rounded-full shadow-xl -m-28 lg:-ml-16"
                      style={{ maxWidth: '150px' }}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center pt-8 gap-2">
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white">
                {!!user && capitalize(user.username)}
              </h1>
              {showCountryFlagForUser(user)}
              {user.username === currentUser?.username && (
                <Button
                  size="xs"
                  onClick={() =>
                    router.push(`/hitchhikers/${currentUser.username}/edit`)
                  }
                >
                  Edit profile
                </Button>
              )}
            </div>
            <p>{!!user && user.about_you}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Show;
