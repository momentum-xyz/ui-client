import React, {FC} from 'react';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';

import {copyToClipboard} from 'core/utils';
import {Dialog, Input} from 'ui-kit';

import * as styled from './LinkDialog.styled';

interface PropsInterface {
  title: string;
  link?: string;
  copyLabel: string;
  onClose: () => void;
}

const LinkDialog: FC<PropsInterface> = ({link, title, copyLabel, onClose}) => {
  const theme = useTheme();

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
      theme={theme}
      title={title}
      headerStyle="uppercase"
      showCloseButton
      onClose={onClose}
      approveInfo={{title: copyLabel, onClick: copyLink}}
      closeOnBackgroundClick={false}
    >
      <styled.Dialog>
        <Input label="" value={link} />
      </styled.Dialog>
    </Dialog>
  );
};

export default LinkDialog;
