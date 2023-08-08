import {AttributeValueInterface} from '@momentum-xyz/sdk';

export interface TextObjectInterface extends AttributeValueInterface {
  title: string;
  content: string;
}

export interface VideoObjectInterface extends AttributeValueInterface {
  youtube_url: string;
}

export interface ImageObjectInterface extends AttributeValueInterface {
  title?: string;
  image?: File;
  render_hash?: string;
}

export interface CustomizableObjectFormInterface {
  text?: string;
  title?: string;
  image?: File;
  imageAIUrl?: string;
}

export interface ObjectTransformFormInterface {
  positionX: number | null;
  positionY: number | null;
  positionZ: number | null;
  rotationX: number | null;
  rotationY: number | null;
  rotationZ: number | null;
  scaleX: number | null;
  scaleY: number | null;
  scaleZ: number | null;
}
