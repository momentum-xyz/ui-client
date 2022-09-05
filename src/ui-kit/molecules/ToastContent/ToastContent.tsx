import React, {FC, memo} from 'react';

import {PropsWithThemeInterface, ToastButtonInfoInterface} from 'ui-kit/interfaces';
import {PanelLayout} from 'ui-kit/organisms';
import {Button, Text} from 'ui-kit/atoms';

import * as styled from './ToastContent.styled';

interface PropsInterface extends PropsWithThemeInterface {
  title?: string;
  headerIconName?: IconNameType;
  text?: string;
  isDanger?: boolean;
  isCloseButton?: boolean;
  approveInfo?: ToastButtonInfoInterface;
  declineInfo?: ToastButtonInfoInterface;
  onClose?: () => void;
}

const ToastContent: FC<PropsInterface> = (props) => {
  const {title, headerIconName, text, isDanger, isCloseButton, approveInfo, declineInfo, onClose} =
    props;

  return (
    <styled.ToastContainer data-testid="ToastContent-test">
      <PanelLayout
        isDanger={isDanger}
        title={title}
        headerIconName={headerIconName}
        headerStyle="uppercase"
        isCloseButton={isCloseButton}
        iconSize="large"
        onClose={onClose}
        componentSize={{width: '100%'}}
        titleWidth="370px"
        headerType="h4"
        isCuttingHeader
        headerHeadingAlign="left"
      >
        <styled.Container>
          <styled.TextItem>
            <Text text={text} size="xs" align="left" />
          </styled.TextItem>
          <styled.ButtonsDiv>
            {declineInfo && (
              <Button label={declineInfo.title} variant="danger" onClick={declineInfo.onClick} />
            )}
            {approveInfo && (
              <Button label={approveInfo.title} variant="primary" onClick={approveInfo.onClick} />
            )}
          </styled.ButtonsDiv>
        </styled.Container>
      </PanelLayout>
    </styled.ToastContainer>
  );
};

export default memo(ToastContent);
