import React, { FC } from 'react';

const ShowErrors: FC<{ errors: Record<string, string[]> | string }> = ({
  errors,
}) => {
  if (typeof errors === 'string') return <>errors</>;
  if (Object.keys(errors).length === 0) return null;
  return (
    <>
      {Object.keys(errors).map((key) => (
        <ul key={key}>
          <li>
            {key}: {errors[key]?.join(' ')}{' '}
          </li>
        </ul>
      ))}
    </>
  );
};

export default ShowErrors;
