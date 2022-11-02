import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {UserSpaceDetailsInterface} from 'core/models';

import {UserSpaceItem} from './components';
import * as styled from './UserSpaceList.styled';

interface PropsInterface {
  spaceList: UserSpaceDetailsInterface[];
  selectSpace: (spaceId: string) => void;
  flyToSpace?: (spaceId: string) => void;
}

const UserSpaceList: FC<PropsInterface> = (props) => {
  const {spaceList, selectSpace, flyToSpace} = props;

  return (
    <styled.Container data-testid="UserSpaceList-test">
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
