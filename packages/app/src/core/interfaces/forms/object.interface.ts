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
}
