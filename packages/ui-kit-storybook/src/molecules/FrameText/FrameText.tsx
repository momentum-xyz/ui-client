import {FC} from 'react';

import * as styled from './FrameText.styled';

export interface FrameTextPropsInterface {
  title: string;
  line1?: string;
  line2?: string;
  imageSrc?: string;
}

const FrameText: FC<FrameTextPropsInterface> = ({title, line1, line2, imageSrc}) => {
  return (
    <styled.Container data-testid="FrameText-test">
      <styled.Title>{title}</styled.Title>
      {line1 && <styled.Line>{line1}</styled.Line>}
      {imageSrc && <styled.Image src={imageSrc} />}
      {line2 && <styled.Line>{line2}</styled.Line>}
    </styled.Container>
  );
};

export default FrameText;
