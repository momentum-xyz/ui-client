export enum InputType {
  Image = 'Image',
  Description = 'Description'
}

export interface AchieverQuoteProperties {
  quote: string;
  footer: string;
  portrait: string;
  portraitAlt: string;
}

export interface PanelInput {
  id: string;
  type: InputType;
  name: string;
  limit: number;
  descriptionTitle: string;
  descriptionLabel: string;
  value: any;
  file: File | null;
}

export interface AchieverPanelProperties {
  title: string;
  imageName: string;
  inputs: PanelInput[];
  isLoading: boolean;
}

export interface AchieverButtonProperties {
  id: string;
  title: string;
  icon: string;
  quote: AchieverQuoteProperties;
  panel: AchieverPanelProperties;
}

export interface AchieverTabProperties {
  id: string;
  icon: string;
  title: string;
  achieverButton: AchieverButtonProperties[];
}

interface Achiever {
  tabs: AchieverTabProperties[];
  currentTab: AchieverTabProperties | null;
  currentButton: AchieverButtonProperties | null;
  isLoading: boolean;
}

export default Achiever;
