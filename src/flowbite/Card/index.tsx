import classNames from 'classnames';
import type { ComponentProps, FC, PropsWithChildren } from 'react';
import theme from '../theme';

export interface CardProps
  extends PropsWithChildren<Omit<ComponentProps<'div'>, 'className'>> {
  horizontal?: boolean;
  href?: string;
  imgAlt?: string;
  imgSrc?: string;
}

export const Card: FC<CardProps> = ({
  children,
  horizontal,
  href,
  imgAlt,
  imgSrc,
  ...props
}): JSX.Element => {
  const Component = typeof href === 'undefined' ? 'div' : 'a';

  return (
    <Component
      className={classNames(
        theme.card.base,
        theme.card.horizontal[horizontal ? 'on' : 'off'],
        href && theme.card.href
      )}
      data-testid="flowbite-card"
    >
      {imgSrc && (
        <img
          alt={imgAlt ?? ''}
          className={classNames(
            theme.card.img.base,
            theme.card.img.horizontal[horizontal ? 'on' : 'off']
          )}
          src={imgSrc}
        />
      )}
      <div className={theme.card.children}>{children}</div>
    </Component>
  );
};
