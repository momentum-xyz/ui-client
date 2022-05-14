interface PushNotification {
  id: string;
  title: string;
  description: string;
  eventType?: NotificationTypes | InteractionTypes;
  meetingSpaceId?: string;
  showWow?: boolean;
  messageId: string;
}

export enum NotificationTypes {
  ERROR = 'error',
  INFORMATION = 'info',
  WARNING = 'warning'
}

export enum InteractionTypes {
  WOW = 'wow',
  HIGHFIVE = 'high-five',
  TEAM_UP = 'team-up',
  TEAM_PILOT = 'team-pilot',
  MEME_UPLOAD = 'meme-upload',
  POSTER_UPLOAD = 'poster-upload',
  GRAB_A_TABLE = 'grab-a-table'
}

export enum CollaborationTypes {
  MIRO_BOARD_CHANGED = 'miro-board-change',
  GOOGLE_DRIVE_FILE_CHANGED = 'google-drive-file-change'
}

export default PushNotification;
