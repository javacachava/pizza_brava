import type { ID, Timestamp } from './SharedTypes';

export interface SystemInfo {
  id: ID;
  version?: string;
  lastSyncAt?: Timestamp;
  firebaseStatus?: {
    firestore?: boolean;
    functions?: boolean;
    auth?: boolean;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
