export interface EventFormInterface {
  start: Date;
  end: Date;
  title: string;
  hosted_by: string;
  web_link: string | null;
  description: string;
  image?: File;
}
