import { Breadcrumb } from 'flowbite-react';
import { Formik } from 'formik';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { FaHome } from 'react-icons/fa';
import PostForm from '../../../src/components/Blog/PostForm';
import { useToasts } from '../../../src/components/contexts/ToastContext';
import { getPost, updatePost } from '../../../src/db/posts';
import { Post } from '../../../src/types/Post';
import { objectToString } from '../../../src/utils';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id;
  const post = await getPost(id as string);
  return {
    props: { post: JSON.parse(JSON.stringify(post.data)) },
  };
};

const EditBlogPost: NextPage<{ post: Post }> = ({ post }) => {
  const { addToast } = useToasts();
  return (
    <div>
      <div className="flex justify-center w-full">
        <Breadcrumb
          aria-label="Solid background breadcrumb example"
          className="px-5 py-3 bg-gray-50 dark:bg-gray-900"
        >
          <Breadcrumb.Item href="/'" icon={FaHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/blog">Blog</Breadcrumb.Item>
          <Breadcrumb.Item href={`/blog/${post.to_param}`}>
            {post.title}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <section className="flex items-center justify-center px-4 py-6 bg-gray-50 dark:bg-gray-900">
        <Formik
          onSubmit={(values, { setSubmitting }) => {
            updatePost(post.id, values)
              .then((res) => {
                addToast('Updated Post');
                window.confetti();
              })
              .catch((err) => {
                addToast(objectToString(err.response.data), 'error');
                console.log(err.response.data);
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
          initialValues={{
            title: post.title,
            body: post.body,
            tag: post.tag,
            summary: post.summary,
            created_at: post.created_at,
            updated_at: post.updated_at,
          }}
          component={(props) => <PostForm {...props} post={post} />}
        />
      </section>
    </div>
  );
};

export default EditBlogPost;
