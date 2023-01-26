import React, {FC, ReactNode} from 'react';
import {useErrorBoundary, withErrorBoundary} from 'react-use-error-boundary';

interface PropsInterface {
  children?: ReactNode;
  errorMessage: string;
}

const ErrorBoundary: FC<PropsInterface> = withErrorBoundary(({children, errorMessage}) => {
  const [error] = useErrorBoundary(console.error);

  if (error) {
    return <h2>{errorMessage}</h2>;
  }

  return <>{children}</>;
});

export default ErrorBoundary;
