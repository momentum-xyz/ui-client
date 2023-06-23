import {FC} from 'react';
import {observer} from 'mobx-react-lite';

import * as styled from './SoundFileForm.styled';

const SoundFileForm: FC = () => {
  return <styled.Container data-testid="SoundFileForm-test">FORM</styled.Container>;
};

export default observer(SoundFileForm);
