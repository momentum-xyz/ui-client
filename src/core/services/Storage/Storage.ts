import {StorageKeyEnum} from 'core/enums';

class Storage {
  set<T>(key: StorageKeyEnum, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  setString(key: StorageKeyEnum, value: string): void {
    localStorage.setItem(key, value);
  }

  get<T>(key: StorageKeyEnum): T | string | null {
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

  delete(key: StorageKeyEnum): void {
    localStorage.removeItem(key);
  }
}

const storage = new Storage();

export {storage};
