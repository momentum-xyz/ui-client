import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';

import {PermanentType, useDashboard} from '../../hooks/api/useDashboardService';
import Button from '../atoms/Button';
import DashboardDynamicView, {DashboardRef} from '../molucules/dashboard/Dashboard';
import Page from '../molucules/Page';
import {useGetSpace} from '../../hooks/api/useSpaceService';
import {ReactComponent as AlertIcon} from '../../images/icons/alert-circle.svg';
import useContextAuth from '../../context/Auth/hooks/useContextAuth';
import {bytesToUuid} from '../../core/utils/uuid.utils';
import VibeButton from '../atoms/VibeButton';
import {ReactComponent as InviteUserIcon} from '../../images/icons/invite-user.svg';
import SocialInviteToSpace from '../molucules/socialui/SocialInviteToSpace';
import {useStore} from '../../shared/hooks';

export interface DashboardSpaceLayoutProps {
  id?: string;
}

interface ParamTypes {
  id: string;
}

const DashboardSpaceLayout: React.FC<DashboardSpaceLayoutProps> = (props) => {
  const {id} = useParams<ParamTypes>();
  const spaceId = props?.id || id;

  const {authState} = useContextAuth();
  const [spaceResponse, spaceLoading] = useGetSpace(spaceId);
  const [dashboard, , , refetchDashboard] = useDashboard(spaceId);
  const space = spaceResponse?.space;

  const dashboardRef = useRef<DashboardRef>(null);

  const userCanEdit = spaceResponse?.admin || spaceResponse?.member;
  const [dashboardEdited, setDashboardEdited] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isStakeShown, setIsStakeShown] = useState<boolean>(false);
  const [showPeopleToInviteList, setShowPeopleToInviteList] = useState(false);

  const {widgetStore, sessionStore} = useStore();
  const {stakingStore} = widgetStore;
  const {stakingDialog} = stakingStore;
  const {isGuest} = sessionStore;

  const inviteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDashboardEdited(true);
    if (dashboard) {
      dashboard.tiles.forEach((tile) => {
        if (
          !tile.edited &&
          (tile.permanentType === PermanentType.POSTER ||
            tile.permanentType === PermanentType.MEME ||
            tile.permanentType === PermanentType.DESCRIPTION ||
            tile.permanentType === PermanentType.VIDEO)
        ) {
          setDashboardEdited(false);
        }
      });
    }
  }, [dashboard]);

  useEffect(() => {
    if (spaceResponse?.space.ownedById && authState.user?.id) {
      try {
        setIsOwner(
          bytesToUuid(spaceResponse?.space?.ownedById?.data) ===
            bytesToUuid(authState?.user?.id.data)
        );
      } catch (e) {
        setIsOwner(false);
      }
    }
  }, [spaceResponse]);

  useEffect(() => {
    if (spaceResponse) {
      setIsStakeShown(!!spaceResponse.space.metadata?.kusama_metadata?.operator_id);
    }
  }, [spaceResponse]);

  useEffect(() => {
    console.info('is owner', isOwner);
  }, [isOwner]);

  const inviteListOffsetLeft = () => {
    return (
      (inviteRef.current?.offsetLeft ?? 0) +
      (inviteRef.current?.offsetParent?.parentElement?.offsetLeft ?? 0) +
      10
    );
  };

  const openStaking = (spaceId: string) => {
    stakingDialog.open();
    stakingStore.setOperatorSpaceId(spaceId);
  };

  const actions = useMemo(
    () => (
      <>
        <VibeButton spaceId={spaceId} />
        {userCanEdit && (
          <Button type="ghost" size="s" onClick={() => dashboardRef.current?.addTile()}>
            add tile
          </Button>
        )}
        <div ref={inviteRef}>
          <Button
            type="ghost"
            size="s"
            onClick={() => {
              setShowPeopleToInviteList(!showPeopleToInviteList);
            }}
          >
            <div className="flex space-x-1">
              <p>Invite People</p>
              <InviteUserIcon />
            </div>
          </Button>
        </div>
        {!isGuest && isStakeShown && (
          <div>
            <Button
              type="ghost"
              size="s"
              onClick={() => {
                openStaking(spaceId);
              }}
            >
              <div className="flex space-x-1">
                <p>Stake</p>
              </div>
            </Button>
          </div>
        )}
      </>
    ),
    [userCanEdit, showPeopleToInviteList, isStakeShown]
  );

  return (
    <Page
      title={space?.name || (spaceLoading ? '' : 'undefined')}
      subtitle="dashboard"
      actions={actions}
      isAdmin={spaceResponse?.admin}
      collaboration={!!props?.id}
    >
      <div className="flex flex-col w-full">
        {!dashboardEdited && isOwner && (
          <div className="border border-red-sunset-100 bg-red-sunset-50 rounded px-2 py-1.5 mb-2 flex">
            <AlertIcon className="text-white-100 w-2 h-2 mr-1" />
            <div>
              <h2 className="font-bold text-white-100 uppercase ">
                UPDATE YOUR SPACE WITH SOME ENTICING CONTENT
              </h2>
              <p>
                Please update your space with a meme and a poster within 1 week (otherwise your
                space will be archived).
              </p>
            </div>
          </div>
        )}
        <DashboardDynamicView
          ref={dashboardRef}
          dashboard={dashboard}
          editing={userCanEdit}
          space={space}
          spaceType={spaceResponse?.spaceType}
          refetch={refetchDashboard}
          staticElements={[null, null, null]}
        />
      </div>
      {showPeopleToInviteList && (
        <div
          className="absolute top-8 z-pop-over"
          style={{
            left: `${inviteListOffsetLeft()}px`
          }}
        >
          <SocialInviteToSpace onClose={() => setShowPeopleToInviteList(false)} />
        </div>
      )}
    </Page>
  );
};

export default DashboardSpaceLayout;
