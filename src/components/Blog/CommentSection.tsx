import { Button, Label, Textarea } from 'flowbite-react';
import { Field, Form, Formik, FormikValues } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { createComment } from '../../db/comments';
import { Comment } from '../../types/Comment';
import CommentComponent from './Comment';

const CommentSection: FC<{ comments: Comment[] }> = (props) => {
  const [comments, setComments] = useState(props.comments);

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
            console.log(values);
            createComment('1', values).then((response) => {
              setComments([...comments, response.data]);
            });
            setSubmitting(false);
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
                        rows={8}
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
              <Button size="xs" type="submit" disabled={isSubmitting}>
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
