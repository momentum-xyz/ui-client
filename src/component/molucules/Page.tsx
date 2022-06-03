import React from 'react';

import TextChatView from '../molucules/collaboration/TextChatView';

import TopBar, {TopBarProps} from './TopBar';

type PageProps = TopBarProps & {
  // eslint-disable-next-line react/no-unused-prop-types
  overflow?: boolean;
};

const Page: React.FC<PageProps> = ({
  children,
  title,
  subtitle,
  actions,
  collaboration = false,
  isAdmin = false,
  adminActions
}) => {
  return (
    <div className="flex flex-col w-full" style={{pointerEvents: 'all'}}>
      <TopBar
        title={title}
        subtitle={subtitle}
        actions={actions}
        collaboration={collaboration}
        isAdmin={isAdmin}
        adminActions={adminActions}
      />
      <div className="h-full flex min-h-0 px-1">
        {children}
        {collaboration && <TextChatView />}
      </div>
    </div>
  );
};

export default Page;
