import {FC, memo, useState} from 'react';

import {Hexagon, Input} from '../../atoms';

import * as styled from './TimelineReaction.styled';

export interface ReactionInterface {
  id: string;
  value: string;
  imageSrc?: string;
}

export interface TimelineReactionPropsInterface {
  list: ReactionInterface[];
  userImageSrc?: string;
  placeholder?: string;
  isReadonly?: boolean;
  onCreate?: (value: string) => void;
}

const TimelineReaction: FC<TimelineReactionPropsInterface> = ({
  userImageSrc,
  list,
  placeholder,
  isReadonly,
  onCreate
}) => {
  const [value, setValue] = useState<string>('');

  return (
    <styled.Container data-testid="TimelineReaction-test">
      {!isReadonly && (
        <styled.NewItem>
          <Hexagon imageSrc={userImageSrc} type="fifth-borderless" />
          <Input
            wide
            size="small"
            value={value}
            onChange={setValue}
            placeholder={placeholder}
            onEnter={() => {
              onCreate?.(value);
              setValue('');
            }}
          />
        </styled.NewItem>
      )}

      <styled.List>
        {list.map((item) => (
          <styled.ListItem key={item.id}>
            <Hexagon imageSrc={item.imageSrc} type="fifth-borderless" />
            <styled.ListItemValue>{item.value}</styled.ListItemValue>
          </styled.ListItem>
        ))}
      </styled.List>
    </styled.Container>
  );
};

export default memo(TimelineReaction);
