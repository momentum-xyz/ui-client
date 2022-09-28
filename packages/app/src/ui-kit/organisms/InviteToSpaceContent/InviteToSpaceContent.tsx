import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';

import {ToastContent} from 'ui-kit/molecules';

interface PropsInterface {
  spaceName: string;
  invitorName: string;
  joinToSpace: () => void;
}

const InviteToSpaceContent: FC<PropsInterface> = ({invitorName, spaceName, joinToSpace}) => {
  const {t} = useTranslation();

  return (
    <ToastContent
      headerIconName="alert"
      text={t('messages.joinSpaceWelcome')}
      title={t('messages.spaceInvitationNote', {
        invitor: invitorName,
        spaceName: spaceName
      })}
      approveInfo={{title: t('titles.joinSpace'), onClick: joinToSpace}}
      showCloseButton
    />
  );
};

export default InviteToSpaceContent;
