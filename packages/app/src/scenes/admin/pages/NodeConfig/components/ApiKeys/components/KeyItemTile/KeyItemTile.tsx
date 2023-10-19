import {FC} from 'react';
import {Heading, Image, Input} from '@momentum-xyz/ui-kit';

import * as styled from './KeyItemTile.styled';

export interface KeyItemTileValueInterface {
  [key: string]: string | number;
}

interface PropsInterface {
  value: KeyItemTileValueInterface | null | undefined;
  defaultValue: KeyItemTileValueInterface;
  onChange: (value: KeyItemTileValueInterface) => void;
  icon: string;
  title: string;
  description?: string;
}

export const KeyItemTile: FC<PropsInterface> = ({
  value,
  defaultValue,
  onChange,
  icon,
  title,
  description
}) => {
  const handleChange = (partialValue: KeyItemTileValueInterface) => {
    onChange({
      ...defaultValue,
      ...value,
      ...partialValue
    });
  };
  return (
    <styled.Container>
      <Image height={40} src={icon} />
      <div>
        <Heading variant="h3">{title}</Heading>
        <span>{description}</span>
      </div>
      <span />
      <styled.Form>
        {Object.entries(defaultValue).map(([key, val]) => (
          <styled.FormRow key={key}>
            <Heading variant="h4">{key}</Heading>

            <Input
              wide
              value={value?.[key] ?? val}
              onChange={(newVal) => {
                handleChange({[key]: typeof val === 'number' ? Number(newVal) : newVal});
              }}
            />
          </styled.FormRow>
        ))}
      </styled.Form>
    </styled.Container>
  );
};
