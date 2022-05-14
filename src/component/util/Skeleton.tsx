import {CSSProperties, ReactNode} from 'react';

type SkeletonProps = {
  count?: number;
  // eslint-disable-next-line react/no-unused-prop-types
  wrapper?: React.ReactElement;
  height?: string;
  width?: string;
  circle?: boolean;
  customClassName?: string;
};

export const Skeleton = ({
  count = 1,
  width,
  height,
  circle = false,
  customClassName
}: SkeletonProps) => {
  const elements: ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    const style: CSSProperties = {};

    if (width !== null) {
      style.width = width;
    }

    if (height !== null) {
      style.height = height;
    }

    if (width !== null && height !== null && circle) {
      style.borderRadius = '50%';
    }

    let className = 'loading-skeleton';
    if (customClassName) {
      className += ' ' + customClassName;
    }

    elements.push(
      <span
        key={i}
        className={className}
        style={{
          ...style
        }}
      >
        &zwnj;
      </span>
    );
  }

  return <>{elements}</>;
};
