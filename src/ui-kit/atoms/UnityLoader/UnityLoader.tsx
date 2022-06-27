import React, {useEffect, useState} from 'react';

import {appVariables} from 'api/constants';
import {ReactComponent as Loader} from 'ui-kit/assets/images/common/odyssey-stamp.svg';

const MESSAGE_TIMEOUT_MS = 5 * 1000;

const UnityLoader: React.FC = () => {
  const [showCacheClear, setShowCacheClear] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCacheClear(true);
    }, MESSAGE_TIMEOUT_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="z-pop-over fixed inset-0 flex flex-col justify-center items-center bg-dark-blue-100">
      <Loader className="w-6 h-6 animate-spin" viewBox="0 0 180 180" />
      <div className="text-center mt-2">
        <h2>Loading Odyssey Momentum</h2>
        <h3>Online Mass Collaboration Arena</h3>
        <h4 className="opacity-50">Version {appVariables.APP_VERSION}</h4>

        {showCacheClear && (
          <div className="fixed bottom-0 left-0 right-0">
            <div className="max-w-[28rem] bg-prime-blue-20 border-2 border-prime-blue-100 mx-auto mb-8 p-1 rounded-lg">
              If Momentum does not load within 30 seconds, please{' '}
              <a
                className="text-prime-blue-100"
                target="_blank"
                title="Click for support on how to clear your cache"
                href="https://wiki.odyssey.org/momentum/help/support"
                rel="noreferrer"
              >
                clear your cache
              </a>
              .
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnityLoader;
