import React from 'react';

import { Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import PostForm from '../../src/components/Blog/PostForm';
import { useToasts } from '../../src/components/contexts/ToastContext';
import { createPost } from '../../src/db/posts';
import Head from 'next/head';

const New: NextPage = () => {
  const { addToast } = useToasts();
  const router = useRouter();

  return (
    <section className="flex items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Hitchlog - new Post</title>
      </Head>
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
