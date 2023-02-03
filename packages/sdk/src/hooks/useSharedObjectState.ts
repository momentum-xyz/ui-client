import {useCallback, useEffect, useState} from 'react';

import {useObjectGlobalProps} from '../contexts/ObjectGlobalPropsContext';
import {AttributeNameEnum} from '../enums';
import {AttributeValueInterface} from '../interfaces';

import {useObject} from './useObject';

type ReturnType<T> = [T | null | undefined, (value: T | null) => Promise<T | null>];

export const useSharedObjectState = <T extends AttributeValueInterface>(
  name: string = AttributeNameEnum.STATE
): ReturnType<T> => {
  const [state, setState] = useState<T | null>();

  const {api} = useObjectGlobalProps();
  const {objectId} = useObject();
  const {
    useAttributeChange,
    useAttributeRemove,
    getSpaceAttributeValue,
    setSpaceAttributeValue,
    deleteSpaceAttribute
  } = api;

  useEffect(() => {
    if (!objectId) {
      return;
    }
    getSpaceAttributeValue<T>(objectId, name)
      .then((data) => setState((state) => (state === undefined ? data : state) ?? null))
      .catch((err) => {
        console.log('Error getting initial value of', name, 'attribute:', err);
        setState(null);
      });
  }, [name, getSpaceAttributeValue, objectId]);

  useAttributeChange<T>('space-attribute-changed', name, setState);
  useAttributeRemove('space-attribute-removed', name, () => setState(null));

  const setSharedState = useCallback(
    async (value: T | null) => {
      if (!objectId) {
        throw new Error('No objectId found in useSharedObjectState');
      }

      const isDelete = value === null || value === undefined;
      console.log('setSharedState', {name, value, isDelete});
      const result = await (isDelete
        ? deleteSpaceAttribute(objectId, name)
        : setSpaceAttributeValue(objectId, name, value));
      console.log('setSharedState result', result);
      setState(result);
      return result;
    },
    [deleteSpaceAttribute, name, objectId, setSpaceAttributeValue]
  );

  return [state, setSharedState];
};
