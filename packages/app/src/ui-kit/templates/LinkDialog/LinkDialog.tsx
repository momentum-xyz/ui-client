import React, {FC} from 'react';
import {toast} from 'react-toastify';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {copyToClipboard} from 'core/utils';
import {Dialog, Input} from 'ui-kit';

import * as styled from './LinkDialog.styled';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  link?: string;
  copyLabel: string;
  onClose: () => void;
}

const LinkDialog: FC<PropsInterface> = ({link, title, copyLabel, onClose}) => {
  const copyLink = () => {
    if (link) {
      copyToClipboard(link).then(() => {
        toast.success('The link is copied to your clipboard.', {
          autoClose: 3000
        });
        onClose();
      });
    }
  };

  return (
    <Dialog
      title={title}
      headerStyle="uppercase"
      showCloseButton
      onClose={onClose}
      approveInfo={{title: copyLabel, onClick: copyLink}}
      closeOnBackgroundClick={false}
    >
      <styled.Dialog data-testid="LinkDialog-test">
        <Input label="" value={link} />
      </styled.Dialog>
    </Dialog>
  );
};

export default LinkDialog;
