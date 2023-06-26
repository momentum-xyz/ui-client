import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {SoundUpload} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import * as styled from './SoundFileForm.styled';

const SoundFileForm: FC = () => {
  const {t} = useI18n();

  console.log(t);

  const [file, setFile] = useState<File>();

  return (
    <styled.Container data-testid="SoundFileForm-test">
      <SoundUpload value={file} onChange={setFile} />
    </styled.Container>
  );
};

export default observer(SoundFileForm);
