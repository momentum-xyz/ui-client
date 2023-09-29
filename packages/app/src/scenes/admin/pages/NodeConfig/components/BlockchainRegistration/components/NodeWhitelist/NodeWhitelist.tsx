import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import {IconButton, Input} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';

import {ETHEREUM_ADDRESS_REGEX} from 'core/utils';
import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './NodeWhitelist.styled';

interface WhitelistItemInterface {
  address: string;
}

interface PropsInterface {
  disabled?: boolean;
}

const NodeWhitelist: FC<PropsInterface> = ({disabled}) => {
  const {
    fetchHostingAllowList,
    hostingAllowListItems,
    addToHostingAllowList,
    removeFromHostingAllowList
  } = useStore().adminStore;
  console.log('hostingAllowListItems', hostingAllowListItems);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue
  } = useForm<WhitelistItemInterface>();

  useEffect(() => {
    fetchHostingAllowList();
  }, [fetchHostingAllowList]);

  const formSubmitHandler = async ({address}: WhitelistItemInterface) => {
    try {
      await addToHostingAllowList({wallet: address});
      await fetchHostingAllowList();
      setValue('address', '', {shouldDirty: false, shouldValidate: false});
      toast.info(<ToastContent icon="checked" text="User added successfully" />);
    } catch (err: any) {
      console.log(err);
      toast.error(<ToastContent icon="alert" text="Something went wrong" />);
    }
  };

  const handleDelete = async (address: string) => {
    if (window.confirm(`Are you sure you want to remove ${address}?`)) {
      try {
        await removeFromHostingAllowList(address);
        await fetchHostingAllowList();
        toast.info(<ToastContent icon="checked" text="User removed successfully" />);
      } catch (err: any) {
        console.log(err);
        toast.error(<ToastContent icon="alert" text="Something went wrong" />);
      }
    }
  };

  return (
    <styled.Container>
      <styled.Title>Whitelist Odysseys</styled.Title>
      <styled.Text>Define the list of Odysseys that can be hosted on your node.</styled.Text>
      <Controller
        control={control}
        name="address"
        rules={{
          required: {
            value: true,
            message: 'Wallet address is required'
          },
          pattern: {
            value: ETHEREUM_ADDRESS_REGEX,
            message: 'Invalid wallet address'
          }
        }}
        render={({field: {value, onChange}}) => (
          <Input
            placeholder="Wallet address"
            onChange={onChange}
            danger={!!errors.address}
            wide
            disabled={disabled}
            value={value}
            onEnter={() => {
              handleSubmit(formSubmitHandler)();
            }}
            actionRight={
              !disabled && (
                <IconButton isWhite name="add_large" onClick={handleSubmit(formSubmitHandler)} />
              )
            }
          />
        )}
      />
      <styled.List>
        {hostingAllowListItems.map((address) => (
          <styled.Item key={address}>
            TODO resolve user id {address}
            <styled.ItemAction>
              <IconButton isWhite name="subtract_large" onClick={() => handleDelete(address)} />
            </styled.ItemAction>
          </styled.Item>
        ))}
      </styled.List>
    </styled.Container>
  );
};

export default observer(NodeWhitelist);
