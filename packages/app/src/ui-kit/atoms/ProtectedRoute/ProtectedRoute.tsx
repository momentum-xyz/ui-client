import React, {FC} from 'react';
import {Redirect, Route} from 'react-router-dom';

import {ProtectedRouteInterface} from 'core/interfaces';

interface PropsInterface extends ProtectedRouteInterface {}

const ProtectedRoute: FC<PropsInterface> = (props) => {
  const {defaultRedirect, hasRights, children, ...rest} = props;
  return (
    <Route
      {...rest}
      render={() => {
        return !hasRights || (hasRights && hasRights()) ? (
          children
        ) : (
          <Redirect to={defaultRedirect} />
        );
      }}
    />
  );
};

export default ProtectedRoute;
