import {useCallback, useRef, useState} from 'react';

import {AttributeValueInterface} from '../../interfaces';

export const useAttributesEmulator = () => {
  const spaceAttributes = useRef<
    Array<{attributeName: string; attributeValue: AttributeValueInterface}>
  >([{attributeName: 'state', attributeValue: {}}]);

  const [subscribed, setSubscribed] = useState(false);
  const [attributeChanged, setAttributeChanged] = useState<{
    attributeName: string;
    value: AttributeValueInterface;
  }>();
  const [attributeRemoved, setAttributeRemoved] = useState<{attributeName: string}>();

  const [attributeItemChanged, setAttributeItemChanged] = useState<{
    attributeName: string;
    attributeItemName: string;
    value: unknown;
  }>();
  const [attributeItemRemoved, setAttributeItemRemoved] = useState<{
    attributeName: string;
    attributeItemName: string;
  }>();

  const useAttributeChange = useCallback(
    (
      _topic: string,
      attributeName: string,
      callback: (name: any, value: AttributeValueInterface) => void
    ) => {
      setInterval(() => {
        if (attributeChanged?.attributeName === attributeName && subscribed) {
          callback(attributeChanged.attributeName, attributeChanged.value);
          setAttributeChanged(undefined);
        }
      }, 500);
    },
    [attributeChanged, subscribed]
  );

  const useAttributeRemove = useCallback(
    (_topic: string, attributeName: string, callback: () => void) => {
      setInterval(() => {
        if (attributeRemoved?.attributeName === attributeName && subscribed) {
          callback();
          setAttributeRemoved(undefined);
        }
      }, 500);
    },
    [attributeRemoved, subscribed]
  );

  const useAttributeItemChange = useCallback(
    (
      _topic: string,
      attributeName: string,
      attributeItemName: string,
      callback: (value: any) => void
    ) => {
      setInterval(() => {
        if (
          attributeItemChanged?.attributeName === attributeName &&
          attributeItemChanged.attributeItemName === attributeItemName &&
          subscribed
        ) {
          callback(attributeItemChanged.value);
          setAttributeItemChanged(undefined);
        }
      }, 500);
    },
    [attributeItemChanged, subscribed]
  );

  const useAttributeItemRemove = useCallback(
    (_topic: string, attributeName: string, attributeItemName: string, callback: () => void) => {
      setInterval(() => {
        if (
          attributeItemRemoved?.attributeName === attributeName &&
          attributeItemRemoved.attributeItemName === attributeItemName &&
          subscribed
        ) {
          callback();
          setAttributeItemChanged(undefined);
        }
      }, 500);
    },
    [attributeItemRemoved, subscribed]
  );

  const subscribeToTopic = useCallback((topic: string) => {
    setSubscribed(topic === 'plugin');
    return Promise.resolve();
  }, []);

  const unsubscribeFromTopic = useCallback((topic: string) => {
    if (topic === 'plugin') {
      setSubscribed(false);
    }
    return Promise.resolve();
  }, []);

  return {
    spaceAttributes,
    useAttributeChange,
    useAttributeRemove,
    useAttributeItemChange,
    useAttributeItemRemove,
    changedAttribute: setAttributeChanged,
    removedAttribute: setAttributeRemoved,
    changedAttributeItem: setAttributeItemChanged,
    removedAttributeItem: setAttributeItemRemoved,
    subscribeToTopic,
    unsubscribeFromTopic
  };
};
