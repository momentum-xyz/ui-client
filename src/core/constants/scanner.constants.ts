import {ScannerInterface} from 'core/interfaces';
import {ScannerEnum} from 'core/enums';

export const SCANNER_LIST: ScannerInterface[] = [
  {
    name: 'DOT SCANNER',
    url: 'https://dotscanner.com/polkadot/account/',
    type: ScannerEnum.Dotscan
  },
  {
    name: 'SUBID',
    url: 'https://sub.id/',
    type: ScannerEnum.Subid
  },
  {
    name: 'SUBSCAN',
    url: 'https://polkadot.subscan.io/account/',
    type: ScannerEnum.Subscan
  }
];
