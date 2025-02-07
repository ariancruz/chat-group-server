export enum EventType {
  MONGODB_URI = 'MONGODB_URI',
  TOKEN_SECRET = 'TOKEN_SECRET',
}

export enum EventsWs {
  ADD_GROUP = 'addGroup',
  UPDATE_GROUP = 'updateGroup',
  REMOVED_GROUP = 'removedGroup',

  NEW_COMMENT = 'newComment',

  IA_LOADING = 'loadingIa',
  TYPING = 'typing',
}
