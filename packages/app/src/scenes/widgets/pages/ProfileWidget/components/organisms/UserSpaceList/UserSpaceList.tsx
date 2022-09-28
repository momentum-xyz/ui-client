import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {Heading} from '@momentum/ui-kit';

import {UserSpaceDetailsInterface} from 'core/models';

import {UserSpaceItem} from './components';
import * as styled from './UserSpaceList.styled';

interface PropsInterface {
  spaceList: UserSpaceDetailsInterface[];
  selectSpace: (spaceId: string) => void;
  flyToSpace: (spaceId: string) => void;
}

const UserSpaceList: FC<PropsInterface> = (props) => {
  const {spaceList, selectSpace, flyToSpace} = props;
  const {t} = useTranslation();

  return (
    <styled.Container data-testid="UserSpaceList-test">
      <Heading type="h4" label={`${t('labels.initiatives')}:`} align="left" />
      <styled.Body>
        {spaceList.length === 0 ? (
          <styled.Placeholder text="-" size="s" align="left" />
        ) : (
          <styled.ListContainer>
            {spaceList.map((space) => {
              const {id, name} = space;
              return (
                <UserSpaceItem
                  key={id}
                  spaceId={id}
                  spaceName={name}
                  flyToSpace={flyToSpace}
                  selectSpace={selectSpace}
                />
              );
            })}
          </styled.ListContainer>
        )}
      </styled.Body>
    </styled.Container>
  );
};

export default observer(UserSpaceList);
