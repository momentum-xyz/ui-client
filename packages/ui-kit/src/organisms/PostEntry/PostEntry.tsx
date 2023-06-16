import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {MediaInterface, PostTypeEnum} from '@momentum-xyz/core';

import {PostAuthorInterface, PostEntryInterface, PostFormInterface} from '../../interfaces';

export interface PostEntryPropsInterface {
  entry?: PostEntryInterface;
  author: PostAuthorInterface;
  canEdit?: boolean;
  videoOrScreenshot?: MediaInterface | null;
  isPending?: boolean;
  isScreenRecording?: boolean;
  onMakeScreenshot: () => void;
  onStartRecording: (maxDuration: number) => void;
  onStopRecording: () => void;
  onClearVideoOrScreenshot: () => void;
  onCreateOrUpdatePost: (form: PostFormInterface, type: PostTypeEnum) => Promise<boolean>;
  onCancelCreation: () => void;
  onDelete?: () => void;
  onVisit?: () => void;
  onShare?: () => void;
}

// TODO: REMOVAL
const PostEntry: FC<PostEntryPropsInterface> = () => {
  return <></>;

  /*const [postTypeIntent, setPostTypeIntent] = useState<PostTypeEnum | null>(null);
  const [mode, setMode] = useState<ModeType>('view');

  useEffect(() => {
    return () => {
      console.log('PostEntry UNMOUNT');
    };
  }, []);

  const handleBack = () => {
    setPostTypeIntent(null);
    onCancelCreation();
  };

  const handleCreateOrUpdate = async (form: PostFormInterface, postType: PostTypeEnum) => {
    if (await onCreateOrUpdatePost(form, postType)) {
      setPostTypeIntent(null);
      setMode('view');
    }
  };

  return (
    <styled.Wrapper data-testid="PostEntry-test">
      <Frame>

        <PostHeading author={author} entry={entry} />

        <styled.Content>
          {/* Creator
          {!entry ? (
            <>
              {/* Create a new screenshot
              {postTypeIntent === PostTypeEnum.SCREENSHOT && (
                <PostImageForm
                  screenshot={videoOrScreenshot?.file}
                  isPending={isPending}
                  onMakeScreenshot={onMakeScreenshot}
                  onClearScreenshot={onClearVideoOrScreenshot}
                  onCreateOrUpdate={(form) => handleCreateOrUpdate(form, PostTypeEnum.SCREENSHOT)}
                  onCancel={handleBack}
                />
              )}

              {/* Create a new video
              {postTypeIntent === PostTypeEnum.VIDEO && (
                <PostVideoForm
                  video={videoOrScreenshot?.file}
                  isPending={isPending}
                  isScreenRecording={isScreenRecording}
                  maxVideoDurationSec={MAX_VIDEO_DURATION}
                  onStartRecording={() => onStartRecording(MAX_VIDEO_DURATION)}
                  onStopRecording={onStopRecording}
                  onClearVideo={onClearVideoOrScreenshot}
                  onCreateOrUpdate={(form) => handleCreateOrUpdate(form, PostTypeEnum.VIDEO)}
                  onCancel={handleBack}
                />
              )}
            </>
          ) : (
            <>
              {/* View screenshot
              {entry.type === PostTypeEnum.SCREENSHOT && mode === 'view' && (
                <PostImageView
                  imageSrc={entry.hashSrc}
                  description={entry.description}
                  onEdit={canEdit ? () => setMode('edit') : undefined}
                  onVisit={onVisit}
                  onShare={onShare}
                />
              )}

              {/* View video
              {entry.type === PostTypeEnum.VIDEO && mode === 'view' && (
                <PostVideoView
                  videoSrc={entry.hashSrc}
                  description={entry.description}
                  onEdit={canEdit ? () => setMode('edit') : undefined}
                  onVisit={onVisit}
                  onShare={onShare}
                />
              )}

              {/* Edit screenshot
              {entry.type === PostTypeEnum.SCREENSHOT && mode === 'edit' && (
                <PostImageForm
                  screenshot={videoOrScreenshot?.file}
                  initialDescription={entry.description}
                  initialScreenshotUrl={entry.hashSrc}
                  isPending={isPending}
                  onMakeScreenshot={onMakeScreenshot}
                  onClearScreenshot={onClearVideoOrScreenshot}
                  onCreateOrUpdate={(form) => handleCreateOrUpdate(form, PostTypeEnum.SCREENSHOT)}
                  onDelete={onDelete}
                  onCancel={() => {
                    handleBack();
                    setMode('view');
                  }}
                />
              )}

              {/* Edit video
              {entry.type === PostTypeEnum.VIDEO && mode === 'edit' && (
                <PostVideoForm
                  video={videoOrScreenshot?.file}
                  initialDescription={entry.description}
                  initialVideoUrl={entry.hashSrc}
                  isPending={isPending}
                  isScreenRecording={isScreenRecording}
                  maxVideoDurationSec={MAX_VIDEO_DURATION}
                  onStartRecording={() => onStartRecording(MAX_VIDEO_DURATION)}
                  onStopRecording={onStopRecording}
                  onClearVideo={onClearVideoOrScreenshot}
                  onCreateOrUpdate={(form) => handleCreateOrUpdate(form, PostTypeEnum.VIDEO)}
                  onDelete={onDelete}
                  onCancel={() => {
                    handleBack();
                    setMode('view');
                  }}
                />
              )}
            </>
          )}
        </styled.Content>
      </Frame>
    </styled.Wrapper>
  );*/
};

export default observer(PostEntry);
