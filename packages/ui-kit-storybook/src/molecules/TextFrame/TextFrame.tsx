import {FC} from 'react';

import * as styled from './TextFrame.styled';

export interface TextFramePropsInterface {
  title: string;
  line1?: string;
  line2?: string;
  imageSrc?: string;
}

const TextFrame: FC<TextFramePropsInterface> = ({title, line1, line2, imageSrc}) => {
  return (
    <styled.Container data-testid="TextFrame-test">
      <styled.Title>{title}</styled.Title>
      {line1 && <styled.Line>{line1}</styled.Line>}
      {imageSrc && <styled.Image src={imageSrc} />}
      {line2 && <styled.Line>{line2}</styled.Line>}
    </styled.Container>
  );
};

export default TextFrame;
