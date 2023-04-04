import {FC} from 'react';

import * as styled from './UserList.styled';

interface PropsInterface {}

const UserList: FC<PropsInterface> = () => {
  return <styled.Wrapper data-testid="UserList-test">UserList</styled.Wrapper>;
};

export default UserList;
