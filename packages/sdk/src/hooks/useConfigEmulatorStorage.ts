import {useCallback, useState} from 'react';

const STORAGE_KEY_PREFIX = 'sdk_emulator_config-';

const readFromLocalStorage = <C = unknown>(plugin_type: string): C => {
  const storageKey = `${STORAGE_KEY_PREFIX}${plugin_type}`;
  const config = localStorage.getItem(storageKey);
  return config ? JSON.parse(config) : {};
};

const saveToLocalStorage = (plugin_type: string, config: unknown) => {
  const storageKey = `${STORAGE_KEY_PREFIX}${plugin_type}`;
  const configString = JSON.stringify(config);
  localStorage.setItem(storageKey, configString);
};

export const useConfigEmulatorStorage = <C = unknown>(plugin_type: string) => {
  const [data, setData] = useState<C>(() => readFromLocalStorage<C>(plugin_type));

  const onSave = useCallback(
    (config: C) => {
      saveToLocalStorage(plugin_type, config);
      setData(config);
    },
    [plugin_type]
  );

  return {
    data,
    onSave
  };
};
