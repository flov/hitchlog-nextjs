import { Button, Label, Textarea, TextInput } from 'flowbite-react';
import { Field, Form, FormikValues } from 'formik';
import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../../types/Post';
import PostComponent from './Post';
import PostCard from './PostCard';

const PostForm: FC<{ post?: Post }> = ({
  isSubmitting,
  values,
  post,
}: FormikValues) => {
  const { currentUser } = useAuth();
  const postMock = {
    id: 1,
    user_id: 1,
    created_at: '2021-01-01',
    updated_at: '2021-01-01',
    to_param: 'post-title',
    author: {
      name: 'Florian Vallen',
      avatar_url: `https://www.gravatar.com/avatar/${currentUser?.md5_email}?s=100`,
      username: 'flov',
    },
    comments: [],
  };
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Form className="">
        <div>
          <Label htmlFor="title">Title</Label>
          <Field name="title">
            {({ field }: FormikValues) => (
              <div className="my-2">
                <TextInput
                  id="title"
                  name="title"
                  placeholder="Type in title"
                  type="text"
                  required
                  {...field}
                />
              </div>
            )}
          </Field>
        </div>
        <div>
          <Label htmlFor="tag">tag</Label>
          <Field name="tag">
            {({ field }: FormikValues) => (
              <div className="my-2">
                <TextInput
                  id="tag"
                  name="tag"
                  placeholder="Type in tag"
                  type="text"
                  required
                  {...field}
                />
              </div>
            )}
          </Field>
        </div>

        <div>
          <Label htmlFor="body">Body</Label>
          <Field name="body">
            {({ field }: FormikValues) => (
              <div className="my-2">
                <Textarea
                  id="body"
                  name="body"
                  placeholder="Type in body"
                  type="text"
                  required
                  rows={10}
                  {...field}
                />
              </div>
            )}
          </Field>
        </div>
        <div>
          <Label htmlFor="summary">Summary</Label>
          <Field name="summary">
            {({ field }: FormikValues) => (
              <div className="my-2">
                <Textarea
                  id="summary"
                  name="summary"
                  placeholder="Type in summary"
                  type="text"
                  rows={20}
                  required
                  {...field}
                />
              </div>
            )}
          </Field>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {!!post ? 'Update' : 'Create'} Post
        </Button>
      </Form>
      <div className="flex flex-col w-full max-w-2xl px-4 mx-auto gap-4 max-w-screen-xl ">
        <PostCard post={{ ...postMock, ...values }} />
        <div>
          <PostComponent post={{ ...postMock, ...post, ...values }} />
          <div className="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <ReactMarkdown>{values.body}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
