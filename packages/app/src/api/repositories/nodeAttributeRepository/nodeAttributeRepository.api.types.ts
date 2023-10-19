import {AttributeValueInterface} from '@momentum-xyz/sdk';

export interface NodeAttributeRequest {
  pluginId: string;
  attributeName: string;
}

export interface NodeAttributeResponse {
  attributeValue: AttributeValueInterface;
}

export interface NodeAttributeValueRequest extends NodeAttributeRequest {
  attributeValue: AttributeValueInterface;
}
