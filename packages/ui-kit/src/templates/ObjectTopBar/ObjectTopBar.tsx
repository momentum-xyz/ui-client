import {FC, PropsWithChildren} from 'react';

import {PropsWithThemeInterface} from '../../interfaces';

import * as styled from './ObjectTopBar.styled';

interface PropsInterface extends PropsWithThemeInterface {
  title: string;
  subtitle?: string;
  isExpanded?: boolean;
  onClose?: () => void;
  onToggleExpand?: () => void;
}

const ObjectTopBar: FC<PropsWithChildren<PropsInterface>> = ({
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
          text={`${title}${subtitle && isExpanded ? ' /' : ''}`}
          transform="uppercase"
          weight="bold"
          theme={theme}
          size="xl"
          isMultiline={false}
        />
        {subtitle && isExpanded && (
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
    <styled.Actions>{children}</styled.Actions>
    <styled.Section>
      {onToggleExpand && (
        <styled.Button
          iconName={isExpanded ? 'minimise' : 'fullscreen'}
          onClick={onToggleExpand}
          size="medium-large"
          isWhite
        />
      )}
      {onClose && <styled.Button iconName="close" onClick={onClose} size="medium-large" isWhite />}
    </styled.Section>
  </styled.Container>
);

export default ObjectTopBar;
