import {ScannerEnum} from 'core/enums';

export interface ScannerInterface {
  name: string;
  url: string;
  type: ScannerEnum;
}
