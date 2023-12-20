import React from 'react';

import { Button as FlowButton } from 'flowbite-react';

export const Button = (props: any) => {
  return (
    <FlowButton color="primary" {...props}>
      {props.children}
    </FlowButton>
  );
};
