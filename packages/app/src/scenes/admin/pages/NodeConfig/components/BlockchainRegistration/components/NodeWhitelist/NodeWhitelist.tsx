import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Controller, useForm} from 'react-hook-form';
import {Heading, Hexagon, IconButton, Input} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';

import {ETHEREUM_ADDRESS_REGEX, getImageAbsoluteUrl} from 'core/utils';
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

  const handleDelete = async (address: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
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
            placeholder="Wallet address like 0xCc5A3155513b3294113657C188cB8c031376aB0A"
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
        {hostingAllowListItems.map(({user_id, name, avatar_hash, wallets}) => (
          <styled.Item key={user_id}>
            <Hexagon
              type="fourth-borderless"
              skipOuterBorder
              imageSrc={getImageAbsoluteUrl(avatar_hash)}
              iconName="astronaut"
            />
            <styled.ItemContent>
              <Heading variant="h4">{name}</Heading>
              <styled.Wallets>
                <div>{wallets.join(', ')}</div>
              </styled.Wallets>
            </styled.ItemContent>
            <styled.ItemAction>
              <IconButton
                isWhite
                name="subtract_large"
                onClick={() => handleDelete(user_id, name)}
              />
            </styled.ItemAction>
          </styled.Item>
        ))}
      </styled.List>
    </styled.Container>
  );
};

export default observer(NodeWhitelist);
