export interface ObjectCommentInterface {
  uuid: string;
  created: string;
  content: string;
}

export interface ObjectCommentWithUserInterface extends ObjectCommentInterface {
  _user: {
    user_id: string;
    profile: {
      avatar_hash: string | null;
      name: string;
    };
  };
}
