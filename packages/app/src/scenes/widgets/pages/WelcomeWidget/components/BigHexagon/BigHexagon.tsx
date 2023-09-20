import {FC, memo} from 'react';
import cn from 'classnames';
import {Button, Hexagon} from '@momentum-xyz/ui-kit';

import {ContentInterface} from '../../WelcomeWidget';

import * as styled from './BigHexagon.styled';

interface PropsInterface {
  inverse?: boolean;
  hexagon: ContentInterface;
}

const BigHexagon: FC<PropsInterface> = ({hexagon, inverse}) => {
  return (
    <styled.BigHexagon className={cn('hex', inverse && 'inverse')} data-testid="BigHexagon-test">
      <styled.Inner>
        <styled.Icon>
          <Hexagon type="fourth-borderless" noHover iconName={hexagon.icon} />
        </styled.Icon>
        <styled.Title>{hexagon.title}</styled.Title>
        <styled.Message className={cn(inverse && 'inverse')}>{hexagon.message}</styled.Message>
        <Button
          wide
          icon={hexagon.icon}
          label={hexagon.actionTitle}
          variant={inverse ? 'third' : 'secondary'}
          onClick={hexagon.onAction}
        />
      </styled.Inner>
    </styled.BigHexagon>
  );
};

export default memo(BigHexagon);
