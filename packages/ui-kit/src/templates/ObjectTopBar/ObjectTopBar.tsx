import {FC} from 'react';

import {SvgButton} from '../../molecules';
import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './ObjectTopBar.styled';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  subtitle?: string;
  isExpanded?: boolean;
  onClose?: () => void;
  onToggleExpand?: () => void;
}

const ObjectTopBar: FC<PropsInterface> = ({
  theme,
  title,
  subtitle,
  onClose,
  onToggleExpand,
  isExpanded = false,
  children
}) => (
  <styled.Container>
    <styled.Section>
      <styled.StyledTexts>
        <styled.StyledText
          text={`${title}${subtitle ? ' /' : ''}`}
          transform="uppercase"
          weight="bold"
          theme={theme}
          size="xl"
          isMultiline={false}
        />
        {subtitle && (
          <>
            &nbsp;
            <styled.StyledText
              text={`${subtitle}`}
              transform="uppercase"
              theme={theme}
              size="xl"
              isMultiline={false}
            />
          </>
        )}
      </styled.StyledTexts>
    </styled.Section>
    {children}
    <styled.Section>
      {onToggleExpand && (
        <SvgButton
          iconName={isExpanded ? 'minimise' : 'fullscreen'}
          onClick={onToggleExpand}
          size="medium-large"
        />
      )}
      {onClose && <SvgButton iconName="close" onClick={onClose} size="medium-large" />}
    </styled.Section>
  </styled.Container>
);

export default ObjectTopBar;
