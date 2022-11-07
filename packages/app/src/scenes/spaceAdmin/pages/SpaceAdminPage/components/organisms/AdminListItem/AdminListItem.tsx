import React, {FC} from 'react';
import {SvgButton, Text} from '@momentum-xyz/ui-kit';

import * as styled from './AdminListItem.styled';

interface PropsInterface {
  name: string;
  userId: string;
  type?: string;
  onEdit?: (id: string, type?: string) => void;
  onRemove: (id: string, name: string) => void;
}

const AdminListItem: FC<PropsInterface> = (props) => {
  const {name, userId, type} = props;

  return (
    <styled.Container>
      <styled.InfoContainer>
        <Text text={name} size="s" align="left" transform="uppercase" weight="bold" />
        {type && <styled.AdminRoleTypeText text={type} size="m" align="left" />}
      </styled.InfoContainer>
      <styled.Buttons>
        {props.onEdit && (
          <SvgButton
            iconName="edit"
            size="normal"
            onClick={() => {
              props.onEdit?.(userId, type);
            }}
          />
        )}
        <SvgButton
          iconName="bin"
          size="normal"
          onClick={() => {
            props.onRemove(userId, name);
          }}
        />
      </styled.Buttons>
    </styled.Container>
  );
};

export default AdminListItem;
