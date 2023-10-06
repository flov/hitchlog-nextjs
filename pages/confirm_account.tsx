import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useToasts } from '../src/components/contexts/ToastContext';
import { confirmAccount } from '../src/db/users';
import { objectToString } from '../src/utils';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const token = query?.token;
  return {
    props: { token },
  };
};

const ConfirmAccount: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const { addToast } = useToasts();

  useEffect(() => {
    confirmAccount(token)
      .then(() => {
        router.push('/login');
        addToast('Account confirmed successfully');
      })
      .catch((error) => {
        console.log({ error });
        router.push('/login');
        addToast(objectToString(error.response.data));
      });
  }, []);

  return <div>{token}</div>;
};

export default ConfirmAccount;
