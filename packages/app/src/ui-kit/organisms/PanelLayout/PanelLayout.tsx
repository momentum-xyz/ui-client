import React, {FC, ReactNode} from 'react';
import cn from 'classnames';
import {Heading,TextAlignType,PropsWithThemeInterface} from '@momentum/ui-kit';

import {
  SvgButton,
  IconSvg,
  HeaderStyleType,
  SizeType,
  ComponentSizeInterface,
  HeaderType,
  HeaderItemType,
} from 'ui-kit';

import * as styled from './PanelLayout.styled';

interface PropsInterface extends PropsWithThemeInterface {
  title?: string;
  subtitle?: string;
  headerIconName?: IconNameType;
  onClose?: () => void;
  headerStyle?: HeaderStyleType;
  isBodyExtendingToEdges?: boolean;
  isDanger?: boolean;
  showCloseButton?: boolean;
  iconSize?: SizeType;
  hasBorder?: boolean;
  headerActions?: ReactNode;
  captureAllPointerEvents?: boolean;
  componentSize?: ComponentSizeInterface;
  headerItem?: HeaderItemType;
  titleWidth?: string;
  headerType?: HeaderType;
  className?: string;
  showOverflow?: boolean;
  noPadding?: boolean;
  headerPlaceholder?: boolean;
  titleHeight?: boolean;
  isTruncateHeader?: boolean;
  showIcon?: boolean;
  headerHeadingAlign?: TextAlignType;
}

const PanelLayout: FC<PropsInterface> = (props) => {
  const {
    children,
    headerStyle = 'normal',
    isBodyExtendingToEdges = false,
    isDanger = false,
    hasBorder = false,
    noPadding = false,
    iconSize = 'small',
    headerItem = 'left',
    headerType = 'h3',
    titleWidth = '100%',
    captureAllPointerEvents = false,
    showOverflow = false,
    headerPlaceholder = false,
    titleHeight = false,
    componentSize,
    className,
    isTruncateHeader = false,
    showIcon = true,
    headerHeadingAlign,
    ...restProps
  } = props;

  return (
    <styled.Container
      data-testid="PanelLayout-test"
      className={cn(
        hasBorder && 'hasBorder',
        captureAllPointerEvents && 'allPointerEvents',
        showOverflow && 'showOverflow',
        className
      )}
      {...componentSize}
    >
      {(headerPlaceholder || restProps.title || (restProps.headerIconName && showIcon)) && (
        <styled.Header
          className={cn(headerStyle, !restProps.title && 'noTitle', titleHeight && 'titleHeight')}
          theme={restProps.theme}
        >
          {restProps.headerIconName && showIcon && (
            <styled.HeaderIconItem>
              <IconSvg
                theme={restProps.theme}
                name={restProps.headerIconName}
                size={iconSize}
                isDanger={isDanger}
              />
            </styled.HeaderIconItem>
          )}
          <styled.HeaderItem className={cn(headerItem)} style={{width: titleWidth}}>
            {restProps.title && (
              <styled.TitleHeading
                theme={restProps.theme}
                type={headerType}
                label={restProps.title}
                transform={headerStyle !== 'divider-uppercase' ? headerStyle : 'uppercase'}
                isDanger={isDanger}
                isTruncate={isTruncateHeader}
                align={headerHeadingAlign}
              />
            )}
            {restProps.subtitle && (
              <>
                <styled.Whitespace />
                <Heading
                  theme={restProps.theme}
                  type={headerType}
                  label="/"
                  transform={headerStyle !== 'divider-uppercase' ? headerStyle : 'uppercase'}
                  isDanger={isDanger}
                  align={headerHeadingAlign}
                />
                <styled.Whitespace />
                <Heading
                  theme={restProps.theme}
                  type={headerType}
                  label={restProps.subtitle}
                  transform={headerStyle !== 'divider-uppercase' ? headerStyle : 'uppercase'}
                  weight="normal"
                  isDanger={isDanger}
                  align={headerHeadingAlign}
                />
              </>
            )}
          </styled.HeaderItem>
          <styled.Spacer />
          <styled.HeaderActions>
            {props.headerActions}
            {(restProps.showCloseButton || restProps.onClose) && (
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
      <styled.Body
        className={cn(isBodyExtendingToEdges && 'extendToEdges', noPadding && 'noPadding')}
      >
        {children}
      </styled.Body>
    </styled.Container>
  );
};

export default PanelLayout;
