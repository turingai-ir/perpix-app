import * as React from 'react';

import { cn } from '@/lib/utils';

const Heading1 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  ),
);

Heading1.displayName = 'Heading1';

const Heading2 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0', className)}
      {...props}
    >
      {children}
    </h2>
  ),
);

Heading2.displayName = 'Heading2';

const Heading3 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  ),
);

Heading3.displayName = 'Heading3';

const Heading4 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h4>
  ),
);

Heading4.displayName = 'Heading4';

const Heading5 = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('scroll-m-20 text-lg font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h5>
  ),
);

Heading5.displayName = 'Heading5';

const Paragraph = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} {...props}>
      {children}
    </p>
  ),
);

Paragraph.displayName = 'Paragraph';

const Muted = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  ),
);

Muted.displayName = 'Muted';

export { Heading1, Heading2, Heading3, Heading4, Heading5, Paragraph, Muted };
