import {FC} from 'react';
import {Heading, Image, Input} from '@momentum-xyz/ui-kit';

import * as styled from './KeyItemTile.styled';

interface PropsInterface {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  icon: string;
  title: string;
  description?: string;
}

export const KeyItemTile: FC<PropsInterface> = ({
  value,
  placeholder,
  onChange,
  icon,
  title,
  description
}) => {
  return (
    <styled.Container>
      <Image height={40} src={icon} />
      <div>
        <Heading variant="h3">{title}</Heading>
        <span>{description}</span>
      </div>
      <span />
      <div>
        <Input wide value={value} placeholder={placeholder} onChange={onChange} />
      </div>
    </styled.Container>
  );
};
