import {useCallback, useEffect, useState} from 'react';

import {useObjectGlobalProps} from '../contexts/ObjectGlobalPropsContext';
import {AttributeNameEnum} from '../enums';
import {AttributeValueInterface} from '../interfaces';

type ReturnType<T> = [T | null | undefined, (value: T | null) => Promise<T | null>];

export const useSharedObjectState = <T extends AttributeValueInterface>(
  name: string = AttributeNameEnum.STATE
): ReturnType<T> => {
  const [state, setState] = useState<T | null>();

  const {pluginApi} = useObjectGlobalProps();
  const {getStateItem, setStateItem, deleteStateItem, useStateItemChange, useStateItemRemove} =
    pluginApi;

  useEffect(() => {
    getStateItem<T>(name)
      .then((data) => setState((state) => (state === undefined ? data : state) ?? null))
      .catch((err) => {
        console.log('Error getting initial value of', name, 'attribute:', err);
        setState(null);
      });
  }, [name, getStateItem]);

  useStateItemChange<T>(name, setState);
  useStateItemRemove(name, () => setState(null));

  const setSharedState = useCallback(
    async (value: T | null) => {
      const isDelete = value === null || value === undefined;
      console.log('setSharedState', {name, value, isDelete});
      const result = await (isDelete ? deleteStateItem(name) : setStateItem(name, value));
      console.log('setSharedState result', result);
      setState(result);
      return result;
    },
    [deleteStateItem, name, setStateItem]
  );

  return [state, setSharedState];
};
