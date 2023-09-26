import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {ObjectTypeIdEnum, RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginIdEnum} from 'api/enums';
import {LeonardoModelIdEnum} from 'core/enums';
import {UserContributionInterface} from 'api/interfaces';
import {MediaUploader} from 'core/models';
import {
  api,
  FetchAIGeneratedImagesResponse,
  GenerateAIImagesResponse,
  SpawnByUserResponse
} from 'api';
import {ContributionAnswersFormInterface, ContributionImageFormInterface} from 'core/interfaces';

import {AnswersData, ImageData} from './models';

const ContributionFormsStore = types.compose(
  ResetModel,
  types
    .model('ContributionFormsStore', {
      answersData: types.optional(AnswersData, {}),
      imageData: types.optional(ImageData, {}),
      mediaUploader: types.optional(MediaUploader, {}),

      isGenerating: false,
      generationJobId: types.maybeNull(types.string),
      generatedImages: types.optional(types.array(types.string), []),

      submitRequest: types.optional(RequestModel, {}),
      generateRequest: types.optional(RequestModel, {}),
      fetchGeneratedRequest: types.optional(RequestModel, {})
    })
    .volatile<{watcher: NodeJS.Timer | null}>(() => ({
      watcher: null
    }))
    .actions((self) => ({
      setAnswersData(form: ContributionAnswersFormInterface): void {
        self.answersData = AnswersData.create({...form});
      },
      setImageData(form: ContributionImageFormInterface): void {
        self.imageData = ImageData.create({
          file: form.file || null,
          fileUrlOrHash: form.fileUrlOrHash || null
        });
      }
    }))
    .actions((self) => ({
      startFetchingImages(): void {
        if (self.watcher) {
          clearInterval(self.watcher);
        }
        self.watcher = setInterval(() => {
          this.fetchGeneratedAIImages();
        }, 1000);
      },
      fetchGeneratedAIImages: flow(function* () {
        const response: FetchAIGeneratedImagesResponse = yield self.fetchGeneratedRequest.send(
          api.aiImagesRepository.fetchImages,
          {
            leonardoId: self.generationJobId || ''
          }
        );

        if (response) {
          const {generated_images} = response.data.generations_by_pk;
          if (generated_images.length > 0) {
            clearInterval(self.watcher || undefined);
            self.generatedImages = cast(generated_images.map((i) => i.url));
            self.isGenerating = false;
          }
        }
      })
    }))
    .actions((self) => ({
      generateAIImages: flow(function* (prompt: string, leonardoModelId: LeonardoModelIdEnum) {
        self.isGenerating = true;

        const response: GenerateAIImagesResponse = yield self.generateRequest.send(
          api.aiImagesRepository.generateImages,
          {
            prompt: prompt,
            model: leonardoModelId
          }
        );

        if (response?.data.sdGenerationJob) {
          self.generationJobId = response.data.sdGenerationJob.generationId;
          self.startFetchingImages();
        } else {
          self.isGenerating = false;
        }
      }),
      clearGeneratedImages(): void {
        self.generatedImages = cast([]);
      }
    }))
    .actions((self) => ({
      submitContribution: flow(function* (canvasObjectId: string) {
        const imageHashOrUrl = self.imageData.fileUrlOrHash
          ? yield self.mediaUploader.uploadImageByUrl(self.imageData.fileUrlOrHash)
          : yield self.mediaUploader.uploadImageOrVideo(self.imageData.file || undefined);

        if (!imageHashOrUrl) {
          return null;
        }

        const attributeValue: UserContributionInterface = {
          created: new Date().toISOString(),
          answerOne: self.answersData.answerOne || '',
          answerTwo: self.answersData.answerTwo || '',
          answerThree: self.answersData.answerThree || '',
          answerFour: self.answersData.answerFour || '',
          render_hash: imageHashOrUrl
        };

        const response: SpawnByUserResponse = yield self.submitRequest.send(
          api.objectRepository.spawnByUser,
          {
            objectId: canvasObjectId,
            object_name: self.answersData.answerOne || '',
            object_type_id: ObjectTypeIdEnum.CANVAS_CHILD,
            attributes: {
              object_user: [
                {
                  plugin_id: PluginIdEnum.CANVAS_EDITOR,
                  attribute_name: AttributeNameEnum.CANVAS_CONTRIBUTION,
                  value: attributeValue
                }
              ]
            }
          }
        );

        if (response?.object_id) {
          return response.object_id;
        }

        return null;
      }),
      clearGeneratedImages(): void {
        self.generatedImages = cast([]);
      }
    }))
    .views((self) => ({
      get isSubmitting(): boolean {
        return self.submitRequest.isPending || self.mediaUploader.isPending;
      }
    }))
);

export {ContributionFormsStore};
