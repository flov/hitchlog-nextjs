import { Formik } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import PostForm from '../../src/components/Blog/PostForm';
import { useAuth } from '../../src/components/contexts/AuthContext';
import { useToasts } from '../../src/components/contexts/ToastContext';
import { createPost } from '../../src/db/posts';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

const New: NextPage = () => {
  const { addToast } = useToasts();
  const router = useRouter();

  return (
    <section className="flex items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-900">
      <Formik
        onSubmit={(values, { setSubmitting }) => {
          createPost(values)
            .then((res) => {
              addToast('Created Post');
              router.push('/blog');
            })
            .catch((err) => {
              addToast('Error creating post', 'error');
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
        initialValues={{
          title: '',
          body: '',
          tag: 'article',
          summary: '',
        }}
        component={(props) => <PostForm {...props} post={undefined} />}
      />
    </section>
  );
};

export default New;
