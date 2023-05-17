import {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {SystemWideError} from '@momentum-xyz/ui-kit';

const WrongBrowserPage: FC = () => {
  const {t} = useI18n();
  return <SystemWideError text={[t('wrongBrowser.title'), t('wrongBrowser.browserList')]} />;
};

export default WrongBrowserPage;
