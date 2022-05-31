import {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';

import {request} from 'api/request';
import {useStore} from 'shared/hooks';
import {appVariables} from 'api/constants';

import {bytesToUuid} from '../../core/utils/uuid.utils';
import User from '../../context/type/User';
import {UserSpace} from '../../context/type/Space';

import {promiseFetch, UseApiOptionsProps, useFetch} from './useApi';

export const useUser = (id: string, options?: UseApiOptionsProps) => {
  const response = useFetch<User>(
    appVariables.BACKEND_ENDPOINT_URL + `/users/profile/${id}`,
    options
  );
  return response;
};

export const useEditUserName = () => {
  return useCallback(async (data) => {
    return request.put(appVariables.BACKEND_ENDPOINT_URL + `/users/set-name`, data);
  }, []);
};

export const useEditAddress = () => {
  return useCallback(async (address) => {
    return request.put(
      appVariables.BACKEND_ENDPOINT_URL + `/address/edit/${bytesToUuid(address.id.data)}`,
      address
    );
  }, []);
};

export const useUserList = (initialIds: string[]) => {
  const [ids, setIds] = useState<string[]>(initialIds);
  const [users, setUsers] = useState<{[key: string]: User | null}>(
    ids.reduce((ac, a) => ({...ac, [a]: null}), {})
  );

  useEffect(() => {
    const internalKeys = Object.keys(users);
    const toAdd = ids.filter((x) => !internalKeys.includes(x));
    const toRemove = internalKeys.filter((x) => !ids.includes(x));
    const newUsers = {...users};
    toRemove.forEach((x) => delete newUsers[x]);
    toAdd.forEach((x) => (newUsers[x] = null));
    setUsers(newUsers);

    Object.keys(newUsers).forEach((x) => {
      if (typeof x === 'string') {
        promiseFetch<User>(appVariables.BACKEND_ENDPOINT_URL + `/users/profile/${x}`).then(
          (user) => {
            setUsers((users) => ({...users, [bytesToUuid(user.id?.data)]: user}));
          }
        );
      }
    });
  }, [ids]);

  const returnValue: [{[key: string]: User | null}, Dispatch<SetStateAction<string[]>>] = [
    users,
    setIds
  ];

  return returnValue;
};

export const useInitiatives = (id: string) => {
  const {worldStore} = useStore().mainStore;
  let apiUrl = appVariables.BACKEND_ENDPOINT_URL + `/users/${id}/initiatives`;
  if (worldStore.worldId) {
    apiUrl = `${apiUrl}?world=${worldStore.worldId}`;
  }
  const response = useFetch<UserSpace[]>(apiUrl, {fetchPolicy: 'network-only'});
  return response;
};

export const useCurrentUser = () => {
  const response = useFetch<User>(appVariables.BACKEND_ENDPOINT_URL + `/users/me`, {
    fetchPolicy: 'network-only'
  });
  return response;
};
