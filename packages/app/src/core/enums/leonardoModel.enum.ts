import {SelectOptionInterface} from '@momentum-xyz/ui-kit';

export enum LeonardoModelIdEnum {
  CREATIVE = '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
  SELECT = 'cd2b2a15-9760-4174-a5ff-4d2925057376',
  SIGNATURE = '291be633-cb24-434f-898f-e662799936ad'
}

export const LEONARDO_MODEL_OPTIONS: SelectOptionInterface<LeonardoModelIdEnum>[] = [
  {
    label: 'Creative',
    value: LeonardoModelIdEnum.CREATIVE
  },
  {
    label: 'Select',
    value: LeonardoModelIdEnum.SELECT
  },
  {
    label: 'Signature',
    value: LeonardoModelIdEnum.SIGNATURE
  }
];
