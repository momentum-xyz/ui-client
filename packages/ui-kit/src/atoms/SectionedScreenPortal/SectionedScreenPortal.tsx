import {FC} from 'react';

import {ScreenSectionsEnum} from '../../enums';
import {Portal} from '../Portal';
import {SECTIONED_SCREEN_ID} from '../SectionedScreen/SectionedScreen';

interface SectionedScreenPortalPropsInterface {
  section: ScreenSectionsEnum;
  maximized?: boolean;
}
export const SectionedScreenPortal: FC<SectionedScreenPortalPropsInterface> = ({
  children,
  section,
  maximized
}) => {
  return (
    <Portal
      className={`sectioned-screen-${section}`}
      parentId={SECTIONED_SCREEN_ID}
      maximized={maximized}
    >
      {children}
    </Portal>
  );
};
