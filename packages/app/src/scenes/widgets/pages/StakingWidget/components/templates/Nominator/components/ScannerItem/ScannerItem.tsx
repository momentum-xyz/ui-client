import React, {FC} from 'react';

import {ScannerEnum} from 'core/enums';
import {ScannerInterface} from 'core/interfaces';
import dotscan from 'static/images/scanners/dotscan.svg';
import subid from 'static/images/scanners/subid.svg';
import subscan from 'static/images/scanners/subscan.svg';

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
