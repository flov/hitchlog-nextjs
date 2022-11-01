import { Formik, FormikValues } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import { SendMessageForm } from '../../../src/components/Forms';
import React from 'react';
import { capitalize } from '../../../src/utils';
import { sendMessage } from '../../../src/db/users';
import { useToasts } from '../../../src/components/contexts/ToastContext';
import { useAuth } from '../../../src/components/contexts/AuthContext';
import { Alert } from 'flowbite-react';
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;

  return {
    props: { username: id },
  };
};

const SendMessage: NextPage<{ username: string }> = ({ username }) => {
  const { addToast } = useToasts();
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleSubmit = (
    values: FormikValues,
    { setSubmitting }: FormikValues
  ) => {
    sendMessage(values.message, username)
      .then((res) => {
        addToast('Message sent', 'success');
        router.push('/hitchhikers/' + username);
      })
      .catch((err) => {
        addToast(err.response?.data?.error, 'error');
        console.log(err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <section className="flex justify-center px-2 py-6 mx-auto sm:px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full p-4 bg-white rounded-lg shadow dark:border sm:max-w-xl dark:bg-gray-800 dark:border-gray-700">
        {currentUser ? (
          <>
            <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
              Send message to {capitalize(username)}
            </h1>

            <Formik
              component={SendMessageForm}
              initialValues={{ message: '' }}
              onSubmit={handleSubmit}
            />
          </>
        ) : (
          <Alert color="info">You need to be logged in to send a message</Alert>
        )}
      </div>
    </section>
  );
};

export default SendMessage;