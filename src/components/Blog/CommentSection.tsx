import { Button, Label, Textarea } from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { createPostComment } from '../../db/comments';
import { Comment } from '../../types/Comment';
import { objectToString } from '../../utils';
import { useToasts } from '../contexts/ToastContext';
import CommentComponent from './Comment';

const CommentSection: FC<{ comments: Comment[]; postId: number }> = (props) => {
  const [comments, setComments] = useState(props.comments);
  const { addToast } = useToasts();

  useEffect(() => {
    setComments(props.comments);
  }, [props.comments]);

  return (
    <div>
      <section className="not-format">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
            Discussion ({comments.length})
          </h2>
        </div>
        <Formik
          onSubmit={(values, { setSubmitting }) => {
            createPostComment(props.postId, values)
              .then((response) => {
                setComments([...comments, response.data]);
              })
              .catch((error) => {
                console.log({ error });
                addToast(objectToString(error.response.data), 'error');
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
          initialValues={{ body: '' }}
        >
          {({ isSubmitting }) => (
            <Form className="mb-6">
              <div>
                <Label htmlFor="body">Comment</Label>
                <Field name="body">
                  {({ field }: FormikValues) => (
                    <div className="mb-4">
                      <Textarea
                        rows={4}
                        id="body"
                        name="body"
                        placeholder="Write a comment..."
                        type="text"
                        required
                        {...field}
                      />
                    </div>
                  )}
                </Field>
              </div>
              <Button size="md" type="submit" disabled={isSubmitting}>
                Post comment
              </Button>
            </Form>
          )}
        </Formik>

        {comments.map((comment: Comment) => (
          <CommentComponent key={comment.created_at} comment={comment} />
        ))}
      </section>
    </div>
  );
};

export default CommentSection;
function addToast(arg0: any, arg1: string) {
  throw new Error('Function not implemented.');
}
