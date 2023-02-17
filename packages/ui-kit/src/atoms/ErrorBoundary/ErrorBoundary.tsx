import React, {FC, PropsWithChildren} from 'react';
import {useErrorBoundary, withErrorBoundary} from 'react-use-error-boundary';

interface PropsInterface {
  errorMessage: string;
}

const ErrorBoundary: FC<PropsWithChildren<PropsInterface>> = withErrorBoundary<
  PropsWithChildren<PropsInterface>
>(({children, errorMessage}) => {
  const [error] = useErrorBoundary(console.error);

  if (error) {
    return <h2>{errorMessage}</h2>;
  }

  return <>{children}</>;
});

export default ErrorBoundary;
