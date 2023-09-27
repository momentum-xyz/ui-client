import {FC} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {IconButton, Input} from '@momentum-xyz/ui-kit';

import {ETHEREUM_ADDRESS_REGEX} from 'core/utils';
// import {ToastContent} from 'ui-kit';

import * as styled from './NodeWhitelist.styled';

interface WhitelistItemInterface {
  address: string;
}

interface PropsInterface {
  disabled?: boolean;
}

// temp
const whitelist: string[] = [];

export const NodeWhitelist: FC<PropsInterface> = ({disabled}) => {
  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm<WhitelistItemInterface>();

  // useEffect(() => {
  //   nodeAdmin?.fetchWhitelist();
  // }, [nodeAdmin]);

  const formSubmitHandler = ({address}: WhitelistItemInterface) => {
    console.log('TODO handle add', address);
  };

  const handleDelete = (address: string) => {
    // if (window.confirm(`Are you sure you want to remove ${address}?`)) {
    console.log('TODO handle delete', address);
    // }
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
        {whitelist.map((address) => (
          <styled.Item key={address}>
            <styled.ItemAction>
              <IconButton isWhite name="subtract_large" onClick={() => handleDelete(address)} />
            </styled.ItemAction>
          </styled.Item>
        ))}
      </styled.List>
    </styled.Container>
  );
};
