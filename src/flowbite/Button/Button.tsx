import React, { ElementType, ReactNode } from 'react';

import {
  ButtonGradientColors,
  ButtonGradientDuoToneColors,
  ButtonSizes,
  Button as Button_1,
  FlowbiteButtonTheme,
  FlowbiteColors,
  PositionInButtonGroup,
} from 'flowbite-react';
import { twMerge } from 'tailwind-merge';
import { buttonTheme } from '../Button';
import { DeepPartial } from 'flowbite-react/lib/types/types';
import { PolymorphicComponentPropWithRef } from 'flowbite-react/lib/types/helpers/generic-as-prop';

export type ButtonProps<T extends ElementType = 'button'> =
  PolymorphicComponentPropWithRef<
    T,
    {
      href?: string;
      color?: keyof FlowbiteColors;
      fullSized?: boolean;
      gradientDuoTone?: keyof ButtonGradientDuoToneColors;
      gradientMonochrome?: keyof ButtonGradientColors;
      target?: string;
      isProcessing?: boolean;
      processingLabel?: string;
      processingSpinner?: ReactNode;
      label?: ReactNode;
      outline?: boolean;
      pill?: boolean;
      positionInGroup?: keyof PositionInButtonGroup;
      size?: keyof ButtonSizes;
      theme?: DeepPartial<FlowbiteButtonTheme>;
      className?: string;
      children: ReactNode;
    }
  >;

export const Button = ({ className, children, ...props }: ButtonProps) => {
  const classes = twMerge(buttonTheme.base, className);

  return (
    <Button_1 color="primary" {...props} className={classes}>
      {children}
    </Button_1>
  );
};
