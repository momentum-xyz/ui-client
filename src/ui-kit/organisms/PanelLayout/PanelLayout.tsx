import React, {FC, ReactNode} from 'react';
import cn from 'classnames';

import {PropsWithThemeInterface} from 'ui-kit/interfaces';
import {
  SvgButton,
  Heading,
  IconSvg,
  HeaderStyleType,
  SizeType,
  ComponentSizeInterface,
  HeaderWeightType,
  HeaderItem
} from 'ui-kit';

import * as styled from './PanelLayout.styled';

interface PropsInterface extends PropsWithThemeInterface {
  title?: string;
  subtitle?: string;
  headerIconName?: IconName;
  // @ts-ignore: refactoring
  onClose?: (event) => void;
  headerStyle?: HeaderStyleType;
  isBodyExtendingToEdges?: boolean;
  isDanger?: boolean;
  isCloseButton?: boolean;
  iconSize?: SizeType;
  isCustom?: boolean;
  hasBorder?: boolean;
  headerActions?: ReactNode;
  captureAllPointerEvents?: boolean;
  componentSize?: ComponentSizeInterface;
  headerItem?: HeaderItem;
  titleWidth?: string;
  headerWeight?: HeaderWeightType;
}

const PanelLayout: FC<PropsInterface> = (props) => {
  const {
    children,
    headerStyle = 'normal',
    isBodyExtendingToEdges = false,
    isDanger = false,
    isCustom = false,
    hasBorder = false,
    iconSize = 'small',
    headerItem = 'left',
    headerWeight = 'h3',
    titleWidth = '100%',
    captureAllPointerEvents = false,
    componentSize,
    ...restProps
  } = props;

  return (
    <styled.Container
      className={cn(
        isCustom && 'PanelLayout-custom',
        hasBorder && 'hasBorder',
        captureAllPointerEvents && 'allPointerEvents'
      )}
      {...componentSize}
    >
      {(restProps.title || restProps.headerIconName) && (
        <styled.Header
          className={cn(headerStyle, !restProps.title && 'noTitle')}
          theme={restProps.theme}
        >
          {restProps.headerIconName && (
            <styled.HeaderIconItem>
              <IconSvg
                theme={restProps.theme}
                name={restProps.headerIconName}
                size={iconSize}
                isDanger={isDanger}
              />
            </styled.HeaderIconItem>
          )}
          <styled.HeaderItem className={cn(headerItem)} titleWidth={titleWidth}>
            {restProps.title && (
              <styled.TitleHeading
                theme={restProps.theme}
                type={headerWeight}
                label={restProps.title}
                transform={headerStyle !== 'divider-uppercase' ? headerStyle : 'uppercase'}
                isDanger={isDanger}
              />
            )}
            {restProps.subtitle && (
              <>
                <Heading
                  theme={restProps.theme}
                  type={headerWeight}
                  label="/"
                  transform={headerStyle !== 'divider-uppercase' ? headerStyle : 'uppercase'}
                  isDanger={isDanger}
                />
                <styled.Whitespace />
                <Heading
                  theme={restProps.theme}
                  type={headerWeight}
                  label={restProps.subtitle}
                  transform={headerStyle !== 'divider-uppercase' ? headerStyle : 'uppercase'}
                  weight="normal"
                  isDanger={isDanger}
                />
              </>
            )}
          </styled.HeaderItem>
          <styled.Spacer />
          <styled.HeaderActions>
            {props.headerActions}
            {(restProps.isCloseButton || restProps.onClose) && (
              <SvgButton
                theme={restProps.theme}
                iconName="close"
                size="normal"
                onClick={restProps.onClose}
                isDanger={isDanger}
              />
            )}
          </styled.HeaderActions>
        </styled.Header>
      )}
      <styled.Body className={cn(isBodyExtendingToEdges && 'extendToEdges')}>
        {children}
      </styled.Body>
    </styled.Container>
  );
};

export default PanelLayout;
