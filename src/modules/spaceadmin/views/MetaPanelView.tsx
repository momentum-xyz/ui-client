import React, {useCallback, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {useHistory} from 'react-router-dom';
import {t} from 'i18next';

import {ROUTES} from 'core/constants';
import {ToastContent, TOAST_BASE_OPTIONS, TOAST_COMMON_OPTIONS} from 'ui-kit';

import Panel, {PanelBody, PanelTitle} from '../../../component/atoms/Panel';
import Input, {Switch} from '../../../component/atoms/input/Input';
import Button from '../../../component/atoms/Button';
import {Space} from '../../../context/type/Space';
import {SpaceSettingsDto, usePutSpace} from '../../../hooks/api/useSpaceService';
import {bytesToUuid} from '../../../core/utils/uuid.utils';
import {useConfirmationDialog} from '../../../hooks/useConformationDialog';
import {useLeaveCollaborationSpace} from '../../../context/Collaboration/hooks/useCollaboration';
import {ReactComponent as Loader} from '../../../images/tail-sping.svg';
import {useDelete} from '../../../hooks/api/useApi';

export interface MetaPanelViewProps {
  space: Space;
  onUpdate: () => void;
  ancestors?: Space[];
}

export const MetaPanelView: React.FC<MetaPanelViewProps> = ({space, onUpdate, ancestors}) => {
  let parentUUID = '';
  if (space.parentId) {
    parentUUID = bytesToUuid(space?.parentId?.data);
  }
  const [updateSpace] = usePutSpace(bytesToUuid(space?.id.data));
  const {getConfirmation} = useConfirmationDialog();
  const history = useHistory();
  const leaveCollaborationSpace = useLeaveCollaborationSpace();
  const [deleteSpace, , ,] = useDelete(
    window._env_.BACKEND_ENDPOINT_URL + `/space/delete/${bytesToUuid(space.id.data)}`
  );

  const [spaceSettings, setSpaceSettings] = useState<SpaceSettingsDto>();

  const spaceDTO = {
    parentId: parentUUID,
    root: space.parentId === undefined,
    name: space?.name,
    description: space?.description,
    secret: space?.secret
  };
  useEffect(() => {
    setSpaceSettings(spaceDTO);
  }, []);

  // @ts-ignore
  const saveSpace = (e) => {
    e.preventDefault();
    if (spaceSettings) {
      updateSpace(spaceSettings)
        .then(() => {
          onUpdate();
          toast.info(
            <ToastContent
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('messages.spaceEditSuccess')}
              isCloseButton
            />,
            TOAST_BASE_OPTIONS
          );
        })
        .catch(() => {
          toast.error(
            <ToastContent
              isDanger
              headerIconName="alert"
              title={t('titles.alert')}
              text={t('messages.spaceSaveFailure')}
              isCloseButton
            />,
            TOAST_COMMON_OPTIONS
          );
        });
    }
  };

  const confirmDeleteSpace = useCallback(() => {
    getConfirmation({
      blockInterface: true,
      title: 'Delete space',
      message: 'Are you sure you want to delete this space?',
      confirmButton: 'Yes, delete',
      cancelButton: 'No, cancel'
    }).then((result) => {
      if (result) {
        deleteSpace({})
          .then(() => leaveCollaborationSpace(true))
          .then(() => {
            history.replace({pathname: ROUTES.base});
          })
          .catch(() => {
            toast.error(
              <ToastContent
                isDanger
                headerIconName="alert"
                title={t('titles.alert')}
                text={t('messages.spaceDeleteFailure')}
                isCloseButton
              />,
              TOAST_COMMON_OPTIONS
            );
          });
      }
    });
  }, [getConfirmation]);

  const parentClicked = (id: string) => {
    history.replace({pathname: '/space/' + id + '/admin'});
  };

  // @ts-ignore
  const getChild = (ancestors: Space[], index = 0) => {
    if (ancestors && index < ancestors.length) {
      const ancestor = ancestors[index];
      if (ancestor.isAdmin === '1') {
        return (
          <>
            <span
              className="breadcrumb-pointer text-prime-blue-100 text-base font-bold font-sans break-words"
              onClick={() => parentClicked(bytesToUuid(ancestor.id.data))}
            >
              {ancestor.name}
            </span>{' '}
            <span>{index !== ancestors.length - 1 ? '>' : ''}</span>{' '}
            {getChild(ancestors, index + 1)}
          </>
        );
      } else {
        return (
          <>
            <span>{ancestor.name}</span> <span>{index !== ancestors.length - 1 ? '>' : ''}</span>{' '}
            {getChild(ancestors, index + 1)}
          </>
        );
      }
    }
  };

  const breadCrumbs = () => {
    if (ancestors) {
      const crumbs = getChild(ancestors);
      return (
        <div className="w-full mb-2 py-2 text-base font-sans border-b-1 border-black-50 capitalize break-words">
          {crumbs}
        </div>
      );
    }
    return;
  };

  if (spaceSettings) {
    return (
      <>
        <Panel className="h-4/6">
          <PanelTitle>Space Details</PanelTitle>
          <PanelBody scroll>
            {breadCrumbs()}
            {/*Make sure the headings are styled correctly see figma*/}
            <h1>Type</h1>
            <br />
            <p>{space.spaceType.name}</p>
            <br />
            <h1>Access</h1>
            <br />
            <Switch
              checked={!!spaceSettings.secret}
              onChange={() =>
                setSpaceSettings({...spaceSettings, secret: Number(!spaceSettings?.secret)})
              }
              name="particles"
              label2="Open to public"
              label="Private space"
            />
            {/*<Select*/}
            {/*	value={spaceSettings.secret}*/}
            {/*	onChange={(e) => setSpaceSettings({...spaceSettings, secret: Number(e.target.value)})}*/}
            {/*>*/}
            {/*	<Option value="0">Public</Option>*/}
            {/*	<Option value="1">Private</Option>*/}
            {/*</Select>*/}
            {/*Set spaceDTO when moving slider, see figma for design*/}
            <form onSubmit={saveSpace} autoComplete="off" className="mt-1">
              <Input
                type="text"
                name="name"
                label="Name"
                onChange={(e) => setSpaceSettings({...spaceSettings, name: e.target.value})}
                defaultValue={spaceSettings.name}
              />
              <div className="flex gap-1 mt-2 pb-1">
                <Button type="primary" submit>
                  Save Details
                </Button>
                <Button type="ghost" onClick={confirmDeleteSpace}>
                  Delete Space
                </Button>
              </div>
            </form>
          </PanelBody>
        </Panel>
      </>
    );
  } else {
    return <Loader className="w-6 h-6 animate-spin fixed top-1/2 left-1/2" viewBox="0 0 180 180" />;
  }
};
