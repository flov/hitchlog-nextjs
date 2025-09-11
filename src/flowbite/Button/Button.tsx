import React, { ReactNode } from 'react';

import { Button as FlowButton } from 'flowbite-react';
import { twMerge } from 'tailwind-merge';
import { buttonTheme } from '../Button';

type Props = {
  className?: string;
  children: ReactNode;
};

export const Button = ({ className, children, ...props }: Props) => {
  const classes = twMerge(buttonTheme.base, className);

  return (
    <FlowButton color="primary" {...props} className={classes}>
      {children}
    </FlowButton>
  );
};
