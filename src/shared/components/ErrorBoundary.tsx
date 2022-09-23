import React, {FC} from 'react';
import {useErrorBoundary, withErrorBoundary} from 'react-use-error-boundary';

interface PropsInterface {
  errorMessage: string;
}

const ErrorBoundary: FC<PropsInterface> = withErrorBoundary(({children, errorMessage}) => {
  const [error] = useErrorBoundary();

  if (error) {
    return <h2>{errorMessage}</h2>;
  }

  return <>{children}</>;
});

export {ErrorBoundary};
