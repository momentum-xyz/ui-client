import {AttributeValueInterface} from 'interfaces';
import {useCallback, useRef, useState} from 'react';

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
    key: string;
    value: unknown;
  }>();
  const [attributeItemRemoved, setAttributeItemRemoved] = useState<{
    attributeName: string;
    key: string;
  }>();

  const onAttributeChange = useCallback(
    (callback) => {
      setInterval(() => {
        if (attributeChanged && subscribed) {
          callback(attributeChanged.attributeName, attributeChanged.value);
          setAttributeChanged(undefined);
        }
      }, 500);
    },
    [attributeChanged, subscribed]
  );

  const onAttributeRemove = useCallback(
    (callback) => {
      setInterval(() => {
        if (attributeRemoved && subscribed) {
          callback(attributeRemoved.attributeName);
          setAttributeRemoved(undefined);
        }
      }, 500);
    },
    [attributeRemoved, subscribed]
  );

  const onAttributeItemChange = useCallback(
    (callback) => {
      setInterval(() => {
        if (attributeItemChanged && subscribed) {
          callback(
            attributeItemChanged.attributeName,
            attributeItemChanged.key,
            attributeItemChanged.value
          );
          setAttributeItemChanged(undefined);
        }
      }, 500);
    },
    [attributeItemChanged, subscribed]
  );

  const onAttributeItemRemove = useCallback(
    (callback) => {
      setInterval(() => {
        if (attributeItemRemoved && subscribed) {
          callback(attributeItemRemoved.attributeName, attributeItemRemoved.key);
          setAttributeItemChanged(undefined);
        }
      }, 500);
    },
    [attributeItemRemoved, subscribed]
  );

  const subscribeToTopic = (topic: string) => {
    setSubscribed(topic === 'plugin');
    return Promise.resolve();
  };

  return {
    spaceAttributes,
    onAttributeChange,
    onAttributeRemove,
    onAttributeItemChange,
    onAttributeItemRemove,
    changedAttribute: setAttributeChanged,
    removedAttribute: setAttributeRemoved,
    changedAttributeItem: setAttributeItemChanged,
    removedAttributeItem: setAttributeItemRemoved,
    subscribeToTopic
  };
};
