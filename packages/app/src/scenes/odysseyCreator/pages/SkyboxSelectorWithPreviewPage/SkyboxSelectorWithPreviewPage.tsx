import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Text, IconSvg, SvgButton} from '@momentum-xyz/ui-kit';
import {toast} from 'react-toastify';
import cn from 'classnames';
import {useParams, useNavigate, generatePath} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import {UploadSkyboxDialog, DeleteSkyboxDialog} from './components';
import * as styled from './SkyboxSelectorWithPreviewPage.styled';

const SkyboxSelectorWithPreviewPage: FC = () => {
  const {odysseyCreatorStore, sessionStore} = useStore();
  const {skyboxSelectorStore} = odysseyCreatorStore;
  const {
    currentItem,
    saveItem,
    changePage,
    prevPage,
    nextPage,
    currPageSkyboxes,
    pages,
    skyboxPageCnt,
    allSkyboxes,
    skyboxCurrentPage,
    currentItemId
  } = skyboxSelectorStore;
  const {user} = sessionStore;

  const {worldId} = useParams<{worldId: string}>();

  const navigate = useNavigate();

  const {t} = useTranslation();

  useEffect(() => {
    if (!user) {
      return;
    }
    skyboxSelectorStore.fetchItems(worldId, user.id);
  }, [skyboxSelectorStore, user, worldId]);

  const hasDialogOpen =
    skyboxSelectorStore.uploadDialog.isOpen || skyboxSelectorStore.deleteDialog.isOpen;

  return (
    <>
      <styled.Container className={hasDialogOpen ? 'blur' : ''}>
        <styled.ItemsGallery>
          <styled.SkyboxCountContainer>
            <styled.SkyboxCount>
              <Text
                text={t('counts.skyboxes', {count: allSkyboxes.length})}
                size="l"
                align="left"
              />
            </styled.SkyboxCount>
          </styled.SkyboxCountContainer>
          {!!currPageSkyboxes && (
            // TODO: Move pager to component
            <styled.SkyboxesContainer>
              <styled.ItemsPage>
                {currPageSkyboxes.map((item, idx) => {
                  const active = item === currentItem;
                  return (
                    <styled.Item
                      className={cn({active})}
                      key={item.id + `-${idx}`}
                      onClick={() => {
                        saveItem(item.id, worldId!).catch((err) => {
                          toast.error(err.message);
                        });
                      }}
                    >
                      {item.isUserAttribute && item.id !== currentItemId && (
                        <styled.DeleteButtonHolder>
                          <SvgButton
                            iconName="bin"
                            size="normal"
                            isWhite
                            onClick={() => {
                              skyboxSelectorStore.openSkyboxDeletion(item.id);
                            }}
                          />
                        </styled.DeleteButtonHolder>
                      )}
                      <styled.PreviewImg src={item.image} />
                      <styled.ItemTitle>{item.name}</styled.ItemTitle>
                      <styled.ItemCreatedBy>
                        {t('titles.by')}{' '}
                        <span>{item.isUserAttribute ? user?.name : 'Odyssey'}</span>
                      </styled.ItemCreatedBy>
                      <styled.ItemButtonHolder>
                        <Button
                          label={
                            currentItem === item
                              ? t('titles.selectedSkybox')
                              : t('actions.selectSkybox')
                          }
                          // variant="inverted"
                          disabled={currentItem === item}
                          transform="uppercase"
                          size="medium"
                          onClick={() => {
                            saveItem(item.id, worldId).catch((err) => {
                              toast.error(err.message);
                            });
                          }}
                        />
                      </styled.ItemButtonHolder>
                    </styled.Item>
                  );
                })}
              </styled.ItemsPage>
              {skyboxPageCnt > 1 && (
                <styled.Pager>
                  <styled.PagerArrowHolder
                    style={{transform: 'scaleX(-1)'}}
                    onClick={() => prevPage()}
                  >
                    <IconSvg name="arrow" size="large" />
                  </styled.PagerArrowHolder>
                  {pages.map((p) => {
                    const activePage = p === skyboxCurrentPage;
                    return (
                      <styled.PageDot
                        className={cn(activePage && 'active-page')}
                        key={`page-dot-${p}`}
                        onClick={() => changePage(p)}
                      />
                    );
                  })}
                  <styled.PagerArrowHolder onClick={() => nextPage()}>
                    <IconSvg name="arrow" size="large" />
                  </styled.PagerArrowHolder>
                </styled.Pager>
              )}
            </styled.SkyboxesContainer>
          )}
        </styled.ItemsGallery>
        <styled.ButtonsHolder>
          <Button label="Add Skybox" onClick={skyboxSelectorStore.uploadDialog.toggle} />
          <Button
            label={t('actions.closePanel')}
            onClick={() => navigate(generatePath(ROUTES.odyssey.creator.base, {worldId}))}
          />
        </styled.ButtonsHolder>
      </styled.Container>
      {skyboxSelectorStore.uploadDialog.isOpen && <UploadSkyboxDialog />}
      {skyboxSelectorStore.deleteDialog.isOpen && <DeleteSkyboxDialog />}
    </>
  );
};

export default observer(SkyboxSelectorWithPreviewPage);
