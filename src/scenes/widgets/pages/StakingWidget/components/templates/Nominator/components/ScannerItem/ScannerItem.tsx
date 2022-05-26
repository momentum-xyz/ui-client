import React, {FC} from 'react';

import {ScannerEnum} from 'core/enums';
import {ScannerInterface} from 'core/interfaces';
import dotscan from 'ui-kit/assets/images/scanners/dotscan.svg';
import subid from 'ui-kit/assets/images/scanners/subid.svg';
import subscan from 'ui-kit/assets/images/scanners/subscan.svg';

import * as styled from './ScannerItem.styled';

interface PropsInterface extends ScannerInterface {}

export const ScannerIcons: {type: ScannerEnum; svg: string}[] = [
  {type: ScannerEnum.Dotscan, svg: dotscan},
  {type: ScannerEnum.Subid, svg: subid},
  {type: ScannerEnum.Subscan, svg: subscan}
];

export const ScannerItem: FC<PropsInterface> = ({name, url, type}) => {
  const scanner = ScannerIcons.find((i) => i.type === type);
  return (
    <styled.ScannerItem href={url} target="_blank" title={name}>
      {scanner && <img src={scanner.svg} alt="" />}
    </styled.ScannerItem>
  );
};
