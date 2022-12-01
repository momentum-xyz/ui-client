import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useLocation} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {LoginTypeEnum} from 'core/enums';

const Web3ConsentPage: FC = () => {
  const {web3ConsentStore} = useStore().authStore_OLD;
  const {loginType, redirectUrl} = web3ConsentStore;

  const {search} = useLocation();

  const urlParams = new URLSearchParams(search as string);
  const challenge = urlParams.get('consent_challenge') || '';

  useEffect(() => {
    if (challenge) {
      web3ConsentStore.fetchLoginType(challenge);
    }
  }, [challenge, web3ConsentStore]);

  useEffect(() => {
    if (!loginType) {
      return;
    }

    if (loginType === LoginTypeEnum.Guest) {
      web3ConsentStore.guestConsentAccept(challenge);
    } else {
      web3ConsentStore.web3consentAccept(challenge);
    }
  }, [challenge, loginType, web3ConsentStore]);

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return <></>;
};
export default observer(Web3ConsentPage);
