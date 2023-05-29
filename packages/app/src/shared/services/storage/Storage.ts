import {StorageKeyEnum} from 'core/enums';

class Storage {
  set<T>(key: StorageKeyEnum, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  setString(key: StorageKeyEnum | string, value: string): void {
    localStorage.setItem(key, value);
  }

  get<T>(key: StorageKeyEnum | string): T | string | null {
    const data: string | null = localStorage.getItem(key);
    try {
      if (data) {
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      return data;
    }
  }

  getByPrefix<T>(prefix: string): T | string | null {
    const keyList: string[] = Object.keys(localStorage);
    const key: string | undefined = keyList.find((key) => key.startsWith(prefix));
    if (!key) {
      return null;
    }

    const data: string | null = localStorage.getItem(key);
    try {
      if (data) {
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      return data;
    }
  }

  delete(key: StorageKeyEnum | string): void {
    localStorage.removeItem(key);
  }
}

const storage = new Storage();

export {storage};
