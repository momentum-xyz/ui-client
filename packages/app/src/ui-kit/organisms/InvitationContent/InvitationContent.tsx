import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {ToastContent} from 'ui-kit/molecules';

interface PropsInterface {
  spaceName?: string;
  invitorName: string;
  join: () => void;
  isTable?: boolean;
}

const InvitationContent: FC<PropsInterface> = ({invitorName, spaceName, join, isTable}) => {
  const {t} = useTranslation();

  return (
    <ToastContent
      headerIconName="alert"
      text={isTable ? t('messages.joinTableWelcome') : t('messages.joinSpaceWelcome')}
      title={
        isTable
          ? t('messages.grabTableInvitationNote', {
              invitor: invitorName
            })
          : t('messages.spaceInvitationNote', {
              invitor: invitorName,
              spaceName: spaceName
            })
      }
      approveInfo={{
        title: isTable ? t('titles.joinTable') : t('titles.joinSpace'),
        onClick: join
      }}
      showCloseButton
    />
  );
};

export default InvitationContent;
