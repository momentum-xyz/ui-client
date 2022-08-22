import {useTranslation} from 'react-i18next';

import {WrongBrowser} from 'ui-kit';

const WrongBrowserPage = () => {
  const {t} = useTranslation();
  return (
    <WrongBrowser
      title={t('wrongBrowser.title')}
      message={t('wrongBrowser.message')}
      browserList={t('wrongBrowser.browserList')}
    />
  );
};

export default WrongBrowserPage;
