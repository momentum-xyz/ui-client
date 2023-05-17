import React, {FC, PropsWithChildren} from 'react';
import {useErrorBoundary, withErrorBoundary} from 'react-use-error-boundary';

export interface ErrorBoundaryPropsInterface {
  errorMessage: string;
}

const ErrorBoundary: FC<PropsWithChildren<ErrorBoundaryPropsInterface>> = withErrorBoundary<
  PropsWithChildren<ErrorBoundaryPropsInterface>
>(({children, errorMessage}) => {
  const [error] = useErrorBoundary(console.error);

  if (error) {
    return <h2>{errorMessage}</h2>;
  }

  return <>{children}</>;
});

export default ErrorBoundary;
