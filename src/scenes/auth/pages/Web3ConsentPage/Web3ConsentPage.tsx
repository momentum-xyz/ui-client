import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useLocation} from 'react-router-dom';

import {useStore} from 'shared/hooks';

const Web3ConsentPage: FC = () => {
  const {web3ConsentStore} = useStore().authStore;
  const {redirectUrl} = web3ConsentStore;

  const {search} = useLocation();

  const urlParams = new URLSearchParams(search as string);
  const challenge = urlParams.get('consent_challenge') || '';

  useEffect(() => {
    if (challenge) {
      web3ConsentStore.consentAccept(challenge);
    }
  }, [challenge, web3ConsentStore]);

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return <></>;
};
export default observer(Web3ConsentPage);
